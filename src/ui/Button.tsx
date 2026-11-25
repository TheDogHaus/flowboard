import type { ComponentProps, ReactNode } from 'react'
import { cx } from './cx'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'action' | 'ghost' | 'danger' | 'subtle' | 'danger-text'

interface ButtonProps extends ComponentProps<'button'> {
  variant?: ButtonVariant
  icon?: ReactNode
  fullWidth?: boolean
}

const variantClass: Record<ButtonVariant, string> = {
  primary: styles.primary,
  action: styles.action,
  ghost: styles.ghost,
  danger: styles.danger,
  subtle: styles.subtle,
  'danger-text': styles.dangerText,
}

export function Button({ variant = 'primary', icon, fullWidth, className, children, type = 'button', ...rest }: ButtonProps) {
  return (
    <button type={type} className={cx(styles.button, variantClass[variant], fullWidth && styles.full, className)} {...rest}>
      {icon}
      {children}
    </button>
  )
}

export function IconButton({ className, children, ...rest }: ComponentProps<'button'> & { 'aria-label': string }) {
  return (
    <button type="button" className={cx(styles.iconButton, className)} {...rest}>
      {children}
    </button>
  )
}
