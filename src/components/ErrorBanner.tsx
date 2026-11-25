import { Button } from '../ui'
import styles from './ErrorBanner.module.css'

export default function ErrorBanner({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div className={styles.banner} role="alert">
      <span>{message}</span>
      <Button variant="ghost" onClick={onDismiss}>
        Dismiss
      </Button>
    </div>
  )
}
