import { cx } from './cx'
import { LogoMark } from './Icon'
import styles from './Badge.module.css'

export type PriorityTone = 'high' | 'medium' | 'low'

export function Badge({ tone, children }: { tone: PriorityTone; children: string }) {
  return <span className={cx(styles.badge, styles[tone])}>{children}</span>
}

export function CountPill({ count }: { count: number }) {
  return <span className={styles.count}>{count}</span>
}

export function Avatar({ initial }: { initial: string }) {
  return (
    <span className={styles.avatar} aria-hidden="true">
      {initial.slice(0, 1).toUpperCase()}
    </span>
  )
}

export function Logo({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  return (
    <span className={cx(styles.logo, size === 'lg' ? styles.logoLg : styles.logoSm)} aria-hidden="true">
      <LogoMark size={size === 'lg' ? 24 : 20} />
    </span>
  )
}
