import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from './supabase'
import type { CardData, CardInput, ColumnId, Priority } from './types'

interface CardRow {
  id: string
  title: string
  description: string
  assignee: string
  priority: Priority
  due_date: string | null
  col: ColumnId
  position: number
}

const COLUMNS_SELECT = 'id,title,description,assignee,priority,due_date,col,position'
const GAP = 1024

const fromRow = (r: CardRow): CardData => ({
  id: r.id,
  title: r.title,
  description: r.description,
  assignee: r.assignee,
  priority: r.priority,
  dueDate: r.due_date ?? '',
  column: r.col,
  position: r.position,
})

const byPosition = (a: CardData, b: CardData) => a.position - b.position

export function useCards(boardId: string) {
  const [cards, setCards] = useState<CardData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const cardsRef = useRef(cards)
  useEffect(() => {
    cardsRef.current = cards
  }, [cards])

  const refresh = useCallback(async () => {
    const { data, error } = await supabase
      .from('cards')
      .select(COLUMNS_SELECT)
      .eq('board_id', boardId)
      .order('position')
    if (error) {
      setError(error.message)
    } else {
      setCards((data as CardRow[]).map(fromRow))
      setError(null)
    }
    setLoading(false)
  }, [boardId])

  useEffect(() => {
    void refresh()
    // Keep this board in sync with changes made by teammates (or other tabs).
    const channel = supabase
      .channel(`cards-${boardId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cards', filter: `board_id=eq.${boardId}` },
        () => void refresh(),
      )
      .subscribe()
    return () => {
      void supabase.removeChannel(channel)
    }
  }, [boardId, refresh])

  // Run a DB write; on failure show the error and re-sync with the server (rolls back optimistic state).
  const run = useCallback(
    async (op: PromiseLike<{ error: { message: string } | null }>) => {
      const { error } = await op
      if (error) {
        setError(error.message)
        await refresh()
      }
    },
    [refresh],
  )

  const addCard = useCallback(
    async (input: CardInput, column: ColumnId) => {
      const inColumn = cardsRef.current.filter((c) => c.column === column)
      const position = inColumn.length ? inColumn[inColumn.length - 1].position + GAP : 0
      const { data, error } = await supabase
        .from('cards')
        .insert({
          board_id: boardId,
          title: input.title,
          description: input.description,
          assignee: input.assignee,
          priority: input.priority,
          due_date: input.dueDate || null,
          col: column,
          position,
        })
        .select(COLUMNS_SELECT)
        .single()
      if (error) {
        setError(error.message)
        return
      }
      const card = fromRow(data as CardRow)
      setCards((prev) => (prev.some((c) => c.id === card.id) ? prev : [...prev, card].sort(byPosition)))
    },
    [boardId],
  )

  const updateCard = useCallback(
    async (id: string, input: CardInput) => {
      setCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...input } : c)))
      await run(
        supabase
          .from('cards')
          .update({
            title: input.title,
            description: input.description,
            assignee: input.assignee,
            priority: input.priority,
            due_date: input.dueDate || null,
          })
          .eq('id', id),
      )
    },
    [run],
  )

  const deleteCard = useCallback(
    async (id: string) => {
      setCards((prev) => prev.filter((c) => c.id !== id))
      await run(supabase.from('cards').delete().eq('id', id))
    },
    [run],
  )

  // Move a card to `index` within `column` (index counts the column as currently displayed).
  const moveCard = useCallback(
    async (id: string, column: ColumnId, index: number) => {
      const current = cardsRef.current
      const card = current.find((c) => c.id === id)
      if (!card) return
      const target = current.filter((c) => c.column === column)
      const from = target.findIndex((c) => c.id === id)
      const at = from !== -1 && from < index ? index - 1 : index
      const others = target.filter((c) => c.id !== id)

      const before = others[at - 1]?.position
      const after = others[at]?.position
      let position: number
      if (before !== undefined && after !== undefined) position = (before + after) / 2
      else if (before !== undefined) position = before + GAP
      else if (after !== undefined) position = after - GAP
      else position = 0

      if (card.column === column && card.position === position) return
      setCards((prev) => prev.map((c) => (c.id === id ? { ...c, column, position } : c)).sort(byPosition))
      await run(supabase.from('cards').update({ col: column, position }).eq('id', id))
    },
    [run],
  )

  return {
    cards,
    loading,
    error,
    clearError: () => setError(null),
    addCard,
    updateCard,
    deleteCard,
    moveCard,
  }
}
