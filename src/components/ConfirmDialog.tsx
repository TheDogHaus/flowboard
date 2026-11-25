import { Button, Modal, ModalFooter } from '../ui'
import styles from './ConfirmDialog.module.css'

interface Props {
  title: string
  message: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel }: Props) {
  return (
    <Modal title={title} onClose={onCancel} width="sm" showClose={false} role="alertdialog" captureEscape>
      <p className={styles.message}>{message}</p>
      <ModalFooter>
        {/* Cancel takes focus so an accidental Enter never deletes. */}
        <Button variant="ghost" onClick={onCancel} autoFocus>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </ModalFooter>
    </Modal>
  )
}
