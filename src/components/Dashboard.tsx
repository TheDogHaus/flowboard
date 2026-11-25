import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, PlusIcon } from '../ui'
import { useBoards } from '../useBoards'
import BoardTile from './BoardTile'
import CreateBoardModal from './CreateBoardModal'
import ErrorBanner from './ErrorBanner'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const { boards, loading, error, clearError, createBoard } = useBoards()
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate()

  const create = async (name: string) => {
    const board = await createBoard(name)
    if (board) {
      setCreating(false)
      navigate(`/boards/${board.id}`)
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>My Boards</h1>
          <Button variant="action" icon={<PlusIcon light size={18} />} onClick={() => setCreating(true)}>
            New Board
          </Button>
        </div>

        {error && <ErrorBanner message={error} onDismiss={clearError} />}

        {!loading && boards.length === 0 ? (
          <p className={styles.empty}>No boards yet. Create your first board to get started.</p>
        ) : (
          <div className={styles.grid} aria-busy={loading}>
            {boards.map((b) => (
              <BoardTile key={b.id} board={b} />
            ))}
          </div>
        )}
      </div>

      {creating && <CreateBoardModal onCreate={(name) => void create(name)} onClose={() => setCreating(false)} />}
    </main>
  )
}
