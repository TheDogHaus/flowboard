import { Link, Outlet } from 'react-router-dom'
import { Avatar, Button, Logo, Navbar } from '../ui'
import styles from './AppShell.module.css'

interface Props {
  userEmail: string
  onSignOut: () => void
}

/** Navbar + page content for every signed-in route. */
export default function AppShell({ userEmail, onSignOut }: Props) {
  return (
    <div className={styles.shell}>
      <Navbar
        left={
          <>
            <Link to="/" className={styles.brand}>
              <Logo />
              <span>FlowBoard</span>
            </Link>
            <Link to="/" className={styles.nav}>
              Boards
            </Link>
          </>
        }
        right={
          <>
            <Avatar initial={userEmail || 'U'} />
            <Button variant="ghost" className={styles.signOut} onClick={onSignOut}>
              Sign out
            </Button>
          </>
        }
      />
      <Outlet />
    </div>
  )
}
