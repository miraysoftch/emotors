import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

const PBKDF2_ITERATIONS = 210000
const SESSION_FILE = path.join(process.cwd(), '.data', 'admin-sessions.json')

// Hash password with salt
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

// Verify password against hash
export function verifyPassword(password: string, hash: string): boolean {
  const [salt, original] = hash.split(':')
  if (!salt || !original) return false
  const newHash = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, 64, 'sha512').toString('hex')
  const expected = Buffer.from(original, 'hex')
  const actual = Buffer.from(newHash, 'hex')
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual)
}

// Generate session token
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Session storage in memory (in production, use database or Redis)
export interface AdminSession {
  token: string
  createdAt: number
  expiresAt: number
  loginAttempts?: number
}

const SESSIONS = new Map<string, AdminSession>()
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000 // 24 hours
const MAX_LOGIN_ATTEMPTS = 5
const ATTEMPT_WINDOW = 15 * 60 * 1000 // 15 minutes

function ensureSessionStore() {
  const dir = path.dirname(SESSION_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function loadPersistedSessions() {
  ensureSessionStore()
  if (!fs.existsSync(SESSION_FILE)) return
  try {
    const rows = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf-8')) as AdminSession[]
    SESSIONS.clear()
    for (const session of rows) {
      if (session.token && Date.now() <= session.expiresAt) {
        SESSIONS.set(session.token, session)
      }
    }
  } catch {
    SESSIONS.clear()
  }
}

function persistSessions() {
  ensureSessionStore()
  const rows = Array.from(SESSIONS.values()).filter((session) => Date.now() <= session.expiresAt)
  fs.writeFileSync(SESSION_FILE, JSON.stringify(rows, null, 2))
}

// Track failed login attempts
const failedAttempts = new Map<string, { count: number; timestamp: number }>()

// Check if account is locked due to failed attempts
export function isAccountLocked(identifier: string): boolean {
  const attempt = failedAttempts.get(identifier)
  if (!attempt) return false

  // Reset if window expired
  if (Date.now() - attempt.timestamp > ATTEMPT_WINDOW) {
    failedAttempts.delete(identifier)
    return false
  }

  return attempt.count >= MAX_LOGIN_ATTEMPTS
}

// Record failed login attempt
export function recordFailedAttempt(identifier: string): void {
  const attempt = failedAttempts.get(identifier)
  if (attempt) {
    attempt.count++
    attempt.timestamp = Date.now()
  } else {
    failedAttempts.set(identifier, { count: 1, timestamp: Date.now() })
  }
}

// Clear failed attempts
export function clearFailedAttempts(identifier: string): void {
  failedAttempts.delete(identifier)
}

// Reset all locks (for admin/debug)
export function resetAllLocks(): void {
  failedAttempts.clear()
}

// Create session
export function createSession(token: string): AdminSession {
  loadPersistedSessions()
  const session: AdminSession = {
    token,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_TIMEOUT,
  }
  SESSIONS.set(token, session)
  persistSessions()
  return session
}

// Get session
export function getSession(token: string): AdminSession | null {
  loadPersistedSessions()
  const session = SESSIONS.get(token)
  if (!session) return null

  // Check if session expired
  if (Date.now() > session.expiresAt) {
    SESSIONS.delete(token)
    persistSessions()
    return null
  }

  return session
}

// Destroy session
export function destroySession(token: string): void {
  loadPersistedSessions()
  SESSIONS.delete(token)
  persistSessions()
}

// Get all sessions (for admin settings)
export function getAllSessions(): AdminSession[] {
  return Array.from(SESSIONS.values())
}

// Cleanup expired sessions
export function cleanupExpiredSessions(): void {
  loadPersistedSessions()
  const now = Date.now()
  for (const [token, session] of SESSIONS.entries()) {
    if (now > session.expiresAt) {
      SESSIONS.delete(token)
    }
  }
  persistSessions()
}

// Admin credentials storage (in production, use database)
export interface AdminCredentials {
  passwordHash: string
  lastChanged: number
  enabled: boolean
  loginHistory: Array<{ timestamp: number; success: boolean; ip?: string }>
}

let adminCredentials: AdminCredentials = {
  passwordHash: getInitialAdminPasswordHash(),
  lastChanged: Date.now(),
  enabled: true,
  loginHistory: [],
}

function getInitialAdminPasswordHash() {
  // Try hash first, then password, then default
  if (process.env.ADMIN_PASSWORD_HASH) {
    console.log('[Admin Auth] Using ADMIN_PASSWORD_HASH from environment')
    return process.env.ADMIN_PASSWORD_HASH
  }
  
  const passwordToHash = process.env.ADMIN_PASSWORD || 'Blevh4np1@@'
  console.log('[Admin Auth] Hashing password from environment or using default')
  
  // Use fixed salt for consistent hashing
  const salt = 'admin_salt_v1'
  const hash = crypto.pbkdf2Sync(passwordToHash, salt, PBKDF2_ITERATIONS, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

// Get admin credentials
export function getAdminCredentials(): AdminCredentials {
  return { ...adminCredentials }
}

// Verify admin password (dynamic, uses env vars on each call)
export function verifyAdminPassword(inputPassword: string): boolean {
  // Get current password from env or default
  const currentPassword = process.env.ADMIN_PASSWORD || 'Blevh4np1@@'
  
  // Simple direct comparison for now (can upgrade to hash later)
  // For security in production, use proper hash verification
  return inputPassword === currentPassword
}

// Update admin password
export function updateAdminPassword(newPassword: string): void {
  adminCredentials.passwordHash = hashPassword(newPassword)
  adminCredentials.lastChanged = Date.now()
}

// Toggle password protection
export function togglePasswordProtection(enabled: boolean): void {
  adminCredentials.enabled = enabled
}

// Record login attempt in history
export function recordLoginHistory(success: boolean, ip?: string): void {
  adminCredentials.loginHistory.push({
    timestamp: Date.now(),
    success,
    ip,
  })
  // Keep only last 100 entries
  if (adminCredentials.loginHistory.length > 100) {
    adminCredentials.loginHistory = adminCredentials.loginHistory.slice(-100)
  }
}

// Get login history
export function getLoginHistory(limit: number = 50): AdminCredentials['loginHistory'] {
  return adminCredentials.loginHistory.slice(-limit)
}

export function isAdminRequestAuthorized(token?: string | null): boolean {
  return Boolean(token && getSession(token))
}
