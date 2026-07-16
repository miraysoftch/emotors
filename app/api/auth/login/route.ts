import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import crypto from 'crypto'
import { verifyPassword } from 'better-auth/crypto'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email ve parola gereklidir.' },
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

    // Find user by email
    const userResult = await pool.query(
      'SELECT id, name, email FROM "user" WHERE LOWER(email) = LOWER($1)',
      [email]
    )

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Geçersiz email veya parola.' },
        { status: 401 }
      )
    }

    const user = userResult.rows[0]

    // Find account with password
    const accountResult = await pool.query(
      'SELECT password FROM "account" WHERE "userId" = $1 AND provider = $2',
      [user.id, 'credential']
    )

    if (accountResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Geçersiz email veya parola.' },
        { status: 401 }
      )
    }

    const account = accountResult.rows[0]
    const storedHash = account?.password

    // Verify password
    if (!storedHash || typeof storedHash !== 'string') {
      console.error('[v0] Password hash missing or invalid type:', typeof storedHash)
      return NextResponse.json(
        { error: 'Geçersiz email veya parola.' },
        { status: 401 }
      )
    }

    let isPasswordValid = false
    try {
      isPasswordValid = await verifyPassword(password, storedHash)
    } catch (verifyError: any) {
      console.error('[v0] Password verification error:', verifyError.message)
      return NextResponse.json(
        { error: 'Giriş işlemi başarısız. Lütfen daha sonra tekrar deneyin.' },
        { status: 500 }
      )
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Geçersiz email veya parola.' },
        { status: 401 }
      )
    }

    // Create session
    const sessionId = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    const sessionToken = crypto.randomBytes(32).toString('hex')
    const now = new Date()

    await pool.query(
      `INSERT INTO "session" (id, "userId", token, "expiresAt", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [sessionId, user.id, sessionToken, expiresAt, now, now]
    )

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        sessionToken,
      },
      {
        status: 200,
        headers: {
          'Set-Cookie': `authToken=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000`,
        },
      }
    )
  } catch (error: any) {
    console.error('[v0] Login error:', error)
    return NextResponse.json(
      { error: 'Giriş işlemi başarısız. Lütfen daha sonra tekrar deneyin.' },
      { status: 500 }
    )
  }
}
