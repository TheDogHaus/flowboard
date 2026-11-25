import { useState, type FormEvent } from 'react'
import { supabase } from '../supabase'
import { Button, Field, Input, SegmentedTabs } from '../ui'
import AuthLayout from './AuthLayout'
import styles from './AuthForm.module.css'

type Mode = 'signin' | 'signup' | 'forgot'

const TABS: { id: 'signin' | 'signup'; label: string }[] = [
  { id: 'signin', label: 'Password' },
  { id: 'signup', label: 'Sign up' },
]

export default function AuthForm() {
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const switchMode = (next: Mode) => {
    setMode(next)
    setError(null)
    setNotice(null)
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    setNotice(null)
    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    } else if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else if (!data.session) setNotice('Check your email to confirm your account, then sign in.')
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) setError(error.message)
      else setNotice('Check your email for a link to reset your password.')
    }
    setBusy(false)
  }

  if (mode === 'forgot') {
    return (
      <AuthLayout subtitle="Reset your password">
        <form className={styles.form} onSubmit={submit}>
          <Field label="Email Address">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoFocus />
          </Field>
          {error && <p className={styles.error} role="alert">{error}</p>}
          {notice && <p className={styles.notice} role="status">{notice}</p>}
          <Button type="submit" fullWidth disabled={busy}>
            Send reset link
          </Button>
          <Button variant="subtle" className={styles.back} onClick={() => switchMode('signin')}>
            Back to sign in
          </Button>
        </form>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout subtitle="Sign in to manage your boards">
      <SegmentedTabs label="Account" tabs={TABS} value={mode} onChange={switchMode} />
      <form className={styles.form} onSubmit={submit}>
        <Field label="Email Address">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoFocus />
        </Field>
        <Field label="Password">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            minLength={6}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          />
        </Field>

        {mode === 'signin' && (
          <div className={styles.forgot}>
            <button type="button" className={styles.link} onClick={() => switchMode('forgot')}>
              Forgot password?
            </button>
          </div>
        )}

        {error && <p className={styles.error} role="alert">{error}</p>}
        {notice && <p className={styles.notice} role="status">{notice}</p>}

        <Button type="submit" fullWidth disabled={busy}>
          {mode === 'signin' ? 'Sign in' : 'Sign up'}
        </Button>
      </form>
    </AuthLayout>
  )
}
