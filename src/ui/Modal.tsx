import { useEffect, type ReactNode } from 'react'
import { cx } from './cx'
import { IconButton } from './Button'
import { CloseIcon } from './Icon'
import styles from './Modal.module.css'

interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
  width?: 'sm' | 'md'
  /** Show the X in the header (the create-board design omits it). */
  showClose?: boolean
  role?: 'dialog' | 'alertdialog'
  /** Handle Escape before anything underneath (for dialogs stacked on another modal). */
  captureEscape?: boolean
}

export function Modal({ title, onClose, children, width = 'md', showClose = true, role = 'dialog', captureEscape = false }: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (captureEscape) e.stopPropagation()
      onClose()
    }
    window.addEventListener('keydown', onKey, captureEscape)
    return () => window.removeEventListener('keydown', onKey, captureEscape)
  }, [onClose, captureEscape])

  return (
    <div className={styles.overlay} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={cx(styles.panel, width === 'sm' ? styles.sm : styles.md)} role={role} aria-modal="true" aria-label={title}>
        <header className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          {showClose && (
            <IconButton aria-label="Close" title="Close" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          )}
        </header>
        {children}
      </div>
    </div>
  )
}

/** Bottom row of a modal: top border, actions aligned right. */
export function ModalFooter({ children }: { children: ReactNode }) {
  return <footer className={styles.footer}>{children}</footer>
}
