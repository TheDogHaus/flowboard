import { Badge, cx, WarningIcon } from '../ui'
import type { CardData } from '../types'
import styles from './Card.module.css'

interface Props {
  card: CardData
  onEdit: (card: CardData) => void
  onDragStart: (id: string) => void
  onDragEnd: () => void
  dragging: boolean
}

function formatDate(iso: string): string {
  if (!iso) return 'No due date'
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function isOverdue(card: CardData): boolean {
  if (!card.dueDate || card.column === 'done') return false
  const t = new Date()
  const today = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
  return card.dueDate < today
}

export default function Card({ card, onEdit, onDragStart, onDragEnd, dragging }: Props) {
  const overdue = isOverdue(card)
  return (
    <article
      className={cx(styles.card, dragging && styles.dragging)}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', card.id)
        onDragStart(card.id)
      }}
      onDragEnd={onDragEnd}
      role="button"
      tabIndex={0}
      aria-label={`Edit ${card.title}`}
      onClick={() => onEdit(card)}
      onKeyDown={(e) => {
        if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onEdit(card)
        }
      }}
    >
      <Badge tone={card.priority.toLowerCase() as 'high' | 'medium' | 'low'}>{card.priority}</Badge>
      <h3 className={styles.title}>{card.title}</h3>
      {card.description && <p className={styles.description}>{card.description}</p>}
      <div className={styles.meta}>
        <span>{card.assignee || 'Unassigned'}</span>
        {overdue ? (
          <span className={styles.overdue} title="Past due">
            <WarningIcon size={12} />
            <span className={styles.srOnly}>Past due: </span>
            {formatDate(card.dueDate)}
          </span>
        ) : (
          <span>{formatDate(card.dueDate)}</span>
        )}
      </div>
    </article>
  )
}
