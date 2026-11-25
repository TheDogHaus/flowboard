import type { ReactNode } from 'react'
import { cx } from './cx'
import styles from './Field.module.css'

interface FieldProps {
  label: string
  /** `caps` is the small uppercase label used for secondary fields. */
  labelStyle?: 'default' | 'caps'
  children: ReactNode
  className?: string
}

/** Label above a form control. Wraps the control so the label is associated with it. */
export function Field({ label, labelStyle = 'default', children, className }: FieldProps) {
  return (
    <label className={cx(styles.field, className)}>
      <span className={labelStyle === 'caps' ? styles.labelCaps : styles.label}>{label}</span>
      {children}
    </label>
  )
}

/** Two fields side by side. */
export function FieldRow({ children }: { children: ReactNode }) {
  return <div className={styles.row}>{children}</div>
}
