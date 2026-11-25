import { Link } from 'react-router-dom'
import type { Board } from '../types'
import styles from './BoardTile.module.css'

export default function BoardTile({ board }: { board: Board }) {
  const created = new Date(board.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  return (
    <Link to={`/boards/${board.id}`} className={styles.tile}>
      <h2 className={styles.name}>{board.name}</h2>
      <p className={styles.date}>{created}</p>
    </Link>
  )
}
