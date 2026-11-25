import { cx } from './cx'
import styles from './SegmentedTabs.module.css'

interface Tab<T extends string> {
  id: T
  label: string
}

interface Props<T extends string> {
  tabs: Tab<T>[]
  value: T
  onChange: (id: T) => void
  label: string
}

export function SegmentedTabs<T extends string>({ tabs, value, onChange, label }: Props<T>) {
  return (
    <div className={styles.group} role="tablist" aria-label={label}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={tab.id === value}
          className={cx(styles.tab, tab.id === value && styles.active)}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
