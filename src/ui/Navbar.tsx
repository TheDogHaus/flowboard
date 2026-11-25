import type { ReactNode } from 'react'
import styles from './Navbar.module.css'

/** Primary top bar: brand/navigation on the left, account actions on the right. */
export function Navbar({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <header className={styles.navbar}>
      <div className={styles.left}>{left}</div>
      <div className={styles.right}>{right}</div>
    </header>
  )
}

/** Secondary bar under the navbar (breadcrumb / page context). */
export function SubNav({ children }: { children: ReactNode }) {
  return <div className={styles.subnav}>{children}</div>
}
