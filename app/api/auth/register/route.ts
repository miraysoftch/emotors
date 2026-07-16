import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import crypto from 'crypto'
import { hashPassword } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password ve name gereklidir.' },
        { status: 400 }
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Geçersiz email adresi.' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Parola en az 8 karakter olmalıdır.' },
        { status: 400 }
      )
    }

    const pool = getPool()
    if (!pool) {
      return NextResponse.json(
        { error: 'Veritabanı bağlantısı başarısız.' },
        { status: 500 }
      )
    }

    // Check if email already exists
    const existingUser = await pool.query(
      'SELECT id FROM "user" WHERE LOWER(email) = LOWER($1)',
      [email]
    )

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'Bu email adresi zaten kullanılmaktadır.' },
        { status: 409 }
      )
    }

    // Create user
    const userId = crypto.randomUUID()
    const now = new Date()

    await pool.query(
      `INSERT INTO "user" (id, name, email, "emailVerified", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, name, email, false, now, now]
    )

    // Create account with password
    const hashedPassword = await hashPassword(password)
    const accountId = crypto.randomUUID()

    await pool.query(
      `INSERT INTO "account" (id, "userId", type, provider, "providerAccountId", password, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [accountId, userId, 'email', 'credential', email, hashedPassword, now, now]
    )

    // Create session
    const sessionId = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    const sessionToken = crypto.randomBytes(32).toString('hex')

    await pool.query(
      `INSERT INTO "session" (id, "userId", token, "expiresAt", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [sessionId, userId, sessionToken, expiresAt, now, now]
    )

    return NextResponse.json(
      {
        user: {
          id: userId,
          name,
          email,
        },
        sessionToken,
      },
      {
        status: 201,
        headers: {
          'Set-Cookie': `authToken=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000`,
        },
      }
    )
  } catch (error: any) {
    console.error('[v0] Registration error:', error)
    return NextResponse.json(
      { error: 'Kayıt işlemi başarısız. Lütfen daha sonra tekrar deneyin.' },
      { status: 500 }
    )
  }
}
