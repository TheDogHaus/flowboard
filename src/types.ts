export type ColumnId = 'backlog' | 'in-progress' | 'in-review' | 'done'
export type Priority = 'High' | 'Medium' | 'Low'

export interface Board {
  id: string
  name: string
  createdAt: string // ISO timestamp
}

export interface CardData {
  id: string
  title: string
  description: string
  assignee: string
  priority: Priority
  dueDate: string // YYYY-MM-DD
  column: ColumnId
  position: number // sort order within the column
}

export type CardInput = Omit<CardData, 'id' | 'column' | 'position'>

export const COLUMNS: { id: ColumnId; label: string }[] = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'in-review', label: 'In Review' },
  { id: 'done', label: 'Done' },
]

export const PRIORITIES: Priority[] = ['High', 'Medium', 'Low']
