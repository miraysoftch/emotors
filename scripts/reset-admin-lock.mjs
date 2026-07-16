// Reset admin login lock
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import path from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')

// Import admin-auth directly
const adminAuthModule = await import(path.join(rootDir, 'lib/admin-auth.ts'))

console.log('🔓 Resetting admin login lock...')

// Clear failed attempts
adminAuthModule.clearFailedAttempts('admin')

console.log('✅ Admin login lock cleared successfully!')
console.log('You can now login with password: Blevh4np1@@')
