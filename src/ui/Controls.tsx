import type { ComponentProps } from 'react'
import { cx } from './cx'
import styles from './Controls.module.css'

export function Input({ className, ...rest }: ComponentProps<'input'>) {
  return <input className={cx(styles.control, styles.input, className)} {...rest} />
}

export function Textarea({ className, ...rest }: ComponentProps<'textarea'>) {
  return <textarea className={cx(styles.control, styles.textarea, className)} {...rest} />
}

export function Select({ className, children, ...rest }: ComponentProps<'select'>) {
  return (
    <select className={cx(styles.control, styles.compact, className)} {...rest}>
      {children}
    </select>
  )
}

export function DateInput({ className, ...rest }: ComponentProps<'input'>) {
  return <input type="date" className={cx(styles.control, styles.compact, className)} {...rest} />
}
