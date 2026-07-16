'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUp } from '@/lib/auth-client'

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate inputs
      if (!name.trim()) {
        setError('Bitte geben Sie Ihren Namen ein.')
        setLoading(false)
        return
      }

      if (!email.trim()) {
        setError('Bitte geben Sie Ihre E-Mail-Adresse ein.')
        setLoading(false)
        return
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Bitte geben Sie eine gültige E-Mail-Adresse ein.')
        setLoading(false)
        return
      }

      if (!password) {
        setError('Bitte geben Sie ein Passwort ein.')
        setLoading(false)
        return
      }

      if (password.length < 8) {
        setError('Das Passwort muss mindestens 8 Zeichen lang sein.')
        setLoading(false)
        return
      }

      if (password !== confirmPassword) {
        setError('Die Passwörter stimmen nicht überein.')
        setLoading(false)
        return
      }

      // Check if email already exists
      const checkResponse = await fetch('/api/auth/register-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone: '' }),
      })

      if (checkResponse.status === 409) {
        setError('Diese E-Mail-Adresse ist bereits in unserem System registriert.')
        setLoading(false)
        return
      }

      // Sign up with custom API
      console.log('[v0] Signing up with email:', email)
      const signupResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name,
        }),
      })

      console.log('[v0] Signup response status:', signupResponse.status)

      if (!signupResponse.ok) {
        const errorData = await signupResponse.json()
        console.log('[v0] Signup error:', errorData)
        setError(errorData.error || 'Registrierung fehlgeschlagen.')
        setLoading(false)
        return
      }

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Signup error:', err)
      setError('Registrierung fehlgeschlagen. Bitte versuchen Sie es später erneut.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Registrierung</h1>
            <p className="text-muted-foreground">Erstellen Sie ein neues Konto</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                placeholder="Ihr Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                E-Mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                placeholder="E-Mail-Adresse"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Passwort
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                placeholder="Passwort (mindestens 8 Zeichen)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Passwort bestätigen
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                placeholder="Passwort wiederholen"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-2 rounded-md font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Wird registriert...' : 'Registrieren'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Bereits registriert?{' '}
              <Link href="/sign-in" className="text-primary hover:underline font-semibold">
                Anmelden
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
