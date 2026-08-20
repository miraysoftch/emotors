'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock } from 'lucide-react'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'request' | 'message'>('request')

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      console.log('[v0] Requesting password reset for:', email)
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        try {
          const errorData = await response.json()
          setError(errorData.error || 'Bir hata oluştu.')
        } catch {
          setError('Bir hata oluştu.')
        }
        setLoading(false)
        return
      }

      const data = await response.json()
      console.log('[v0] Password reset requested successfully')
      setSuccess(data.message)
      setStep('message')
      setLoading(false)
    } catch (err: any) {
      console.error('[v0] Forgot password error:', err)
      setError('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="flex flex-col items-center space-y-2">
          <div className="rounded-full bg-primary/10 p-3">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Şifremi Unuttum</h1>
          <p className="text-sm text-muted-foreground">
            {step === 'request'
              ? 'Hesabınızı kurtarmak için e-mail adresinizi girin'
              : 'Şifre sıfırlama talimatlarını kontrol edin'}
          </p>
        </div>

        {step === 'request' ? (
          <form onSubmit={handleForgotPassword} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                E-mail Adresi
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail adresinizi girin"
                className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={loading || !email}
              className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Linki Gönder'}
            </button>

            {/* Back to Login */}
            <div className="text-center">
              <Link href="/login" className="text-sm text-primary hover:underline">
                Giriş sayfasına dön
              </Link>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Success Message */}
            <div className="rounded-lg bg-green-500/10 p-4 text-sm text-green-600 border border-green-200">
              {success}
            </div>

            {/* Instructions */}
            <div className="space-y-4 rounded-lg bg-secondary p-4">
              <p className="text-sm text-foreground">
                Şifre sıfırlama bağlantısı e-mail adresinize gönderilmiştir. Lütfen e-mail'inizi kontrol edin.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <span className="mt-1">•</span>
                  <span>Bağlantı 1 saat geçerli olacaktır</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="mt-1">•</span>
                  <span>Spam klasörünü de kontrol edin</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="mt-1">•</span>
                  <span>Bağlantıya tıklayarak yeni şifre belirleyin</span>
                </li>
              </ul>
            </div>

            {/* Back Button */}
            <button
              onClick={() => {
                setStep('request')
                setEmail('')
                setSuccess('')
              }}
              className="w-full rounded-lg border border-input bg-background px-4 py-2 font-medium text-foreground hover:bg-secondary transition-colors"
            >
              Başka bir e-mail ile deneyin
            </button>

            <div className="text-center">
              <Link href="/login" className="text-sm text-primary hover:underline">
                Giriş sayfasına dön
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
