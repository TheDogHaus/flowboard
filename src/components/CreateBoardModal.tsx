import { useState, type FormEvent } from 'react'
import { Button, Field, Input, Modal, ModalFooter } from '../ui'
import styles from './CardModal.module.css'

interface Props {
  onCreate: (name: string) => void
  onClose: () => void
}

export default function CreateBoardModal({ onCreate, onClose }: Props) {
  const [name, setName] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (name.trim()) onCreate(name.trim())
  }

  return (
    <Modal title="Create board" onClose={onClose} width="sm" showClose={false}>
      <form className={styles.form} onSubmit={submit}>
        <Field label="Board name">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Product Roadmap" required maxLength={80} autoFocus />
        </Field>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Create</Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
