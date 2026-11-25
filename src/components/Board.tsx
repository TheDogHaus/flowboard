import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SubNav } from '../ui'
import { COLUMNS, type CardData, type CardInput, type ColumnId } from '../types'
import { useBoards } from '../useBoards'
import { useCards } from '../useCards'
import Column from './Column'
import CardModal from './CardModal'
import ConfirmDialog from './ConfirmDialog'
import ErrorBanner from './ErrorBanner'
import styles from './Board.module.css'

type ModalState =
  | { mode: 'closed' }
  | { mode: 'create'; column: ColumnId }
  | { mode: 'edit'; card: CardData }

export default function Board() {
  const { id = '' } = useParams()
  const { boards, loading: boardsLoading } = useBoards()
  const board = boards.find((b) => b.id === id)

  if (!board) {
    return (
      <main className={styles.notFound}>
        {boardsLoading ? <p>Loading board…</p> : <p>Board not found. <Link to="/">Back to your boards</Link></p>}
      </main>
    )
  }

  return <BoardView boardId={board.id} boardName={board.name} />
}

function BoardView({ boardId, boardName }: { boardId: string; boardName: string }) {
  const { cards, loading, error, clearError, addCard, updateCard, deleteCard, moveCard } = useCards(boardId)
  const [modal, setModal] = useState<ModalState>({ mode: 'closed' })
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<CardData | null>(null)

  const close = () => setModal({ mode: 'closed' })

  const save = (input: CardInput) => {
    if (modal.mode === 'create') void addCard(input, modal.column)
    else if (modal.mode === 'edit') void updateCard(modal.card.id, input)
    close()
  }

  const move = (id: string, column: ColumnId, index: number) => {
    void moveCard(id, column, index)
    setDraggingId(null)
  }

  const confirmRemove = () => {
    if (!pendingDelete) return
    void deleteCard(pendingDelete.id)
    setPendingDelete(null)
    close()
  }

  return (
    <>
      <SubNav>
        <Link to="/" className={styles.crumb}>
          Boards
        </Link>
        <span className={styles.crumb} aria-hidden="true">
          /
        </span>
        <h1 className={styles.name}>{boardName}</h1>
        <span className={styles.meta}>{COLUMNS.length} columns</span>
      </SubNav>

      {error && <ErrorBanner message={error} onDismiss={clearError} />}

      <main className={styles.board} aria-busy={loading}>
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            id={col.id}
            label={col.label}
            cards={cards.filter((c) => c.column === col.id)}
            draggingId={draggingId}
            onDropCard={move}
            onEdit={(card) => setModal({ mode: 'edit', card })}
            onDragStart={setDraggingId}
            onDragEnd={() => setDraggingId(null)}
            onAdd={(column) => setModal({ mode: 'create', column })}
          />
        ))}
      </main>

      {pendingDelete && (
        <ConfirmDialog
          title="Delete card?"
          message={`"${pendingDelete.title}" will be permanently removed.`}
          confirmLabel="Delete"
          onConfirm={confirmRemove}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      {modal.mode !== 'closed' && (
        <CardModal
          card={modal.mode === 'edit' ? modal.card : null}
          onSave={save}
          onClose={close}
          onDelete={modal.mode === 'edit' ? () => setPendingDelete(modal.card) : undefined}
        />
      )}
    </>
  )
}
