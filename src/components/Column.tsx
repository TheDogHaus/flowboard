import { Fragment, useRef, useState } from 'react'
import { Button, CountPill, cx, PlusIcon, UploadIcon } from '../ui'
import type { CardData, ColumnId } from '../types'
import Card from './Card'
import styles from './Column.module.css'

interface Props {
  id: ColumnId
  label: string
  cards: CardData[]
  draggingId: string | null
  onDropCard: (cardId: string, column: ColumnId, index: number) => void
  onEdit: (card: CardData) => void
  onDragStart: (id: string) => void
  onDragEnd: () => void
  onAdd: (column: ColumnId) => void
}

export default function Column({ id, label, cards, draggingId, onDropCard, onEdit, onDragStart, onDragEnd, onAdd }: Props) {
  const [over, setOver] = useState(false)
  const [dropIndex, setDropIndex] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)

  // Index (0..cards.length) where a card dropped at this Y position would be inserted.
  const indexAt = (clientY: number): number => {
    const els = listRef.current?.querySelectorAll<HTMLElement>('[data-card]') ?? []
    for (let i = 0; i < els.length; i++) {
      const r = els[i].getBoundingClientRect()
      if (clientY < r.top + r.height / 2) return i
    }
    return els.length
  }

  const showLine = over && draggingId !== null

  return (
    <section
      className={cx(styles.column, over && styles.over)}
      aria-label={label}
      onDragOver={(e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        setOver(true)
        setDropIndex(indexAt(e.clientY))
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOver(false)
      }}
      onDrop={(e) => {
        e.preventDefault()
        setOver(false)
        const cardId = e.dataTransfer.getData('text/plain') || draggingId
        if (cardId) onDropCard(cardId, id, indexAt(e.clientY))
      }}
    >
      <header className={styles.header}>
        <h2 className={styles.title}>{label}</h2>
        <CountPill count={cards.length} />
      </header>

      <div className={styles.cards} ref={listRef}>
        {cards.map((card, i) => (
          <Fragment key={card.id}>
            {showLine && dropIndex === i && <div className={styles.dropLine} />}
            <div data-card>
              <Card card={card} dragging={card.id === draggingId} onEdit={onEdit} onDragStart={onDragStart} onDragEnd={onDragEnd} />
            </div>
          </Fragment>
        ))}
        {showLine && cards.length > 0 && dropIndex === cards.length && <div className={styles.dropLine} />}
        {cards.length === 0 && (
          <div className={styles.empty}>
            <UploadIcon />
            <p>Drop a card here or add one below</p>
          </div>
        )}
      </div>

      <Button variant="subtle" icon={<PlusIcon />} onClick={() => onAdd(id)} aria-label={`Add card to ${label}`}>
        Add card
      </Button>
    </section>
  )
}
