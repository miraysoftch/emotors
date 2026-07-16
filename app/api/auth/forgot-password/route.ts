import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import crypto from 'crypto'

const PASSWORD_RESET_TOKENS = new Map<string, { userId: string; email: string; expiresAt: number }>()

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email gereklidir.' },
        { status: 400 }
      )
    }

    const pool = getPool()
    if (!pool) {
      return NextResponse.json(
        { error: 'Veritabanı bağlantısı başarısız' },
        { status: 500 }
      )
    }

    // Find user by email
    const userResult = await pool.query(
      'SELECT id FROM "user" WHERE LOWER(email) = LOWER($1)',
      [email]
    )

    if (userResult.rows.length === 0) {
      // Don't reveal if email exists (security best practice)
      return NextResponse.json({
        message: 'Eğer bu email sistemde kayıtlıysa, şifre sıfırlama bağlantısı gönderilecektir.',
      })
    }

    const user = userResult.rows[0]
    const resetToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = Date.now() + 1 * 60 * 60 * 1000 // 1 hour

    // Store reset token in memory (in production, use database)
    PASSWORD_RESET_TOKENS.set(resetToken, {
      userId: user.id,
      email,
      expiresAt,
    })

    // In production, send email with reset link
    const resetLink = `${request.headers.get('x-forwarded-proto') || 'http'}://${request.headers.get('host')}/reset-password?token=${resetToken}`
    console.log('[v0] Password reset link:', resetLink)
    console.log('[v0] Reset token saved:', resetToken)

    return NextResponse.json({
      message: 'Eğer bu email sistemde kayıtlıysa, şifre sıfırlama bağlantısı gönderilecektir.',
      // Remove in production - only for demo
      ...(process.env.NODE_ENV === 'development' && { resetToken, resetLink }),
    })
  } catch (error: any) {
    console.error('[v0] Forgot password error:', error.message)
    return NextResponse.json(
      { error: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.json(
      { error: 'Token gereklidir.' },
      { status: 400 }
    )
  }

  const resetData = PASSWORD_RESET_TOKENS.get(token)

  if (!resetData || resetData.expiresAt < Date.now()) {
    return NextResponse.json(
      { error: 'Token geçersiz veya süresi dolmuş.' },
      { status: 401 }
    )
  }

  return NextResponse.json({
    email: resetData.email,
    token,
  })
}

// Reset password with token
export async function PUT(request: NextRequest) {
  try {
    const { token, password, confirmPassword } = await request.json()

    if (!token || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Tüm alanlar gereklidir.' },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Şifreler eşleşmiyor.' },
        { status: 400 }
      )
    }

    const resetData = PASSWORD_RESET_TOKENS.get(token)

    if (!resetData || resetData.expiresAt < Date.now()) {
      return NextResponse.json(
        { error: 'Token geçersiz veya süresi dolmuş.' },
        { status: 401 }
      )
    }

    const pool = getPool()
    if (!pool) {
      return NextResponse.json(
        { error: 'Veritabanı bağlantısı başarısız' },
        { status: 500 }
      )
    }

    // Import hashPassword from admin-auth
    const { hashPassword } = await import('@/lib/admin-auth')

    // Hash new password
    const hashedPassword = hashPassword(password)

    // Update password in account table
    await pool.query(
      'UPDATE "account" SET password = $1, "updatedAt" = $2 WHERE "userId" = $3 AND provider = $4',
      [hashedPassword, new Date(), resetData.userId, 'credential']
    )

    // Clear reset token
    PASSWORD_RESET_TOKENS.delete(token)

    return NextResponse.json({
      message: 'Şifre başarıyla sıfırlandı. Giriş sayfasına yönlendiriliyorsunuz.',
    })
  } catch (error: any) {
    console.error('[v0] Reset password error:', error.message)
    return NextResponse.json(
      { error: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.' },
      { status: 500 }
    )
  }
}
