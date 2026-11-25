import { useState, type FormEvent } from 'react'
import { Button, DateInput, Field, FieldRow, Input, Modal, ModalFooter, Select, Textarea } from '../ui'
import { PRIORITIES, type CardData, type CardInput, type Priority } from '../types'
import styles from './CardModal.module.css'

interface Props {
  card: CardData | null // null = creating
  onSave: (input: CardInput) => void
  onClose: () => void
  onDelete?: () => void // only provided when editing an existing card
}

export default function CardModal({ card, onSave, onClose, onDelete }: Props) {
  const [title, setTitle] = useState(card?.title ?? '')
  const [description, setDescription] = useState(card?.description ?? '')
  const [assignee, setAssignee] = useState(card?.assignee ?? '')
  const [priority, setPriority] = useState<Priority>(card?.priority ?? 'Medium')
  const [dueDate, setDueDate] = useState(card?.dueDate ?? '')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSave({ title: title.trim(), description: description.trim(), assignee: assignee.trim(), priority, dueDate })
  }

  return (
    <Modal title={card ? 'Edit card' : 'New card'} onClose={onClose}>
      <form className={styles.form} onSubmit={submit}>
        <Field label="Name">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter card name..." required maxLength={120} autoFocus />
        </Field>

        <Field label="Description" labelStyle="caps">
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add a description..." maxLength={2000} />
        </Field>

        <Field label="Assignee" labelStyle="caps">
          <Input value={assignee} onChange={(e) => setAssignee(e.target.value)} placeholder="Who is responsible?" required maxLength={60} />
        </Field>

        <FieldRow>
          <Field label="Priority" labelStyle="caps">
            <Select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Due date" labelStyle="caps">
            <DateInput value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
          </Field>
        </FieldRow>

        <ModalFooter>
          {onDelete && (
            <Button variant="danger-text" onClick={onDelete}>
              Delete card
            </Button>
          )}
          <Button type="submit">{card ? 'Save' : 'Add card'}</Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
