import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { Button, Field, Input } from '../ui'
import AuthLayout from './AuthLayout'
import styles from './AuthForm.module.css'

/** Shown after the user follows the emailed recovery link (which signs them in). */
export default function ResetPassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setBusy(true)
    setError(null)
    const { error } = await supabase.auth.updateUser({ password })
    setBusy(false)
    if (error) setError(error.message)
    else navigate('/', { replace: true })
  }

  return (
    <AuthLayout subtitle="Choose a new password">
      <form className={styles.form} onSubmit={submit}>
        <Field label="New password">
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoComplete="new-password" autoFocus />
        </Field>
        <Field label="Confirm password">
          <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={6} autoComplete="new-password" />
        </Field>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <Button type="submit" fullWidth disabled={busy}>
          Update password
        </Button>
      </form>
    </AuthLayout>
  )
}
