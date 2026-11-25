import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'
import type { Board } from './types'

interface BoardRow {
  id: string
  name: string
  created_at: string
}

const fromRow = (r: BoardRow): Board => ({ id: r.id, name: r.name, createdAt: r.created_at })

export function useBoards() {
  const [boards, setBoards] = useState<Board[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    const { data, error } = await supabase
      .from('boards')
      .select('id,name,created_at')
      .order('created_at', { ascending: false })
    if (error) {
      setError(error.message)
    } else {
      setBoards((data as BoardRow[]).map(fromRow))
      setError(null)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    void refresh()
    const channel = supabase
      .channel('boards-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'boards' }, () => void refresh())
      .subscribe()
    return () => {
      void supabase.removeChannel(channel)
    }
  }, [refresh])

  /** Creates a board and returns it, or null if the insert failed (error is set). */
  const createBoard = useCallback(async (name: string): Promise<Board | null> => {
    const { data, error } = await supabase.from('boards').insert({ name }).select('id,name,created_at').single()
    if (error) {
      setError(error.message)
      return null
    }
    const board = fromRow(data as BoardRow)
    setBoards((prev) => (prev.some((b) => b.id === board.id) ? prev : [board, ...prev]))
    return board
  }, [])

  return { boards, loading, error, clearError: () => setError(null), createBoard }
}
