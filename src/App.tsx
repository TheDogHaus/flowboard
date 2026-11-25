import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import AppShell from './components/AppShell'
import AuthForm from './components/AuthForm'
import Board from './components/Board'
import Dashboard from './components/Dashboard'
import ResetPassword from './components/ResetPassword'
import Styleguide from './components/Styleguide'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setReady(true)
    })
    const { data } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next)
      // Following the emailed recovery link signs the user in; send them to set a new password.
      if (event === 'PASSWORD_RECOVERY') navigate('/reset-password', { replace: true })
    })
    return () => data.subscription.unsubscribe()
  }, [navigate])

  if (!ready) return null
  if (!session) return <AuthForm />

  return (
    <Routes>
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<AppShell userEmail={session.user.email ?? ''} onSignOut={() => void supabase.auth.signOut()} />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/boards/:id" element={<Board />} />
        <Route path="/styleguide" element={<Styleguide />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
