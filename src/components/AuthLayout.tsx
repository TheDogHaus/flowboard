import type { ReactNode } from 'react'
import { Logo } from '../ui'
import styles from './AuthLayout.module.css'

/** Centered brand header + white panel used by sign-in, sign-up, forgot and reset screens. */
export default function AuthLayout({ subtitle, children }: { subtitle: string; children: ReactNode }) {
  return (
    <div className={styles.page}>
      <div className={styles.brand}>
        <Logo size="lg" />
        <h1 className={styles.name}>FlowBoard</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
      <div className={styles.panel}>{children}</div>
    </div>
  )
}
