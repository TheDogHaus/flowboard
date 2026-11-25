import { useState } from 'react'
import { Avatar, Badge, Button, CountPill, DateInput, Field, FieldRow, Input, Logo, PlusIcon, SegmentedTabs, Select, Textarea } from '../ui'
import styles from './Styleguide.module.css'

const SWATCHES = [
  ['primary', '--color-primary'],
  ['action', '--color-action'],
  ['text', '--color-text'],
  ['text-muted', '--color-text-muted'],
  ['bg', '--color-bg'],
  ['column', '--color-column'],
  ['border', '--color-border'],
  ['danger', '--color-danger'],
  ['input-focus', '--color-input-focus'],
  ['avatar', '--color-avatar'],
] as const

/** Dev-only reference page: every token and ui/ component in one place (route: /styleguide). */
export default function Styleguide() {
  const [tab, setTab] = useState<'a' | 'b'>('a')
  return (
    <main className={styles.page}>
      <h1>Design system</h1>

      <section className={styles.section}>
        <h2>Colour tokens</h2>
        <div className={styles.swatches}>
          {SWATCHES.map(([name, v]) => (
            <div key={name} className={styles.swatch}>
              <span className={styles.chip} style={{ background: `var(${v})` }} />
              <code>{v}</code>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Buttons</h2>
        <div className={styles.row}>
          <Button>Primary</Button>
          <Button variant="action" icon={<PlusIcon light size={18} />}>New Board</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="subtle" icon={<PlusIcon />}>Add card</Button>
          <Button variant="danger-text">Delete card</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Form controls</h2>
        <div className={styles.form}>
          <Field label="Name"><Input placeholder="Enter card name..." /></Field>
          <Field label="Description" labelStyle="caps"><Textarea placeholder="Add a description..." /></Field>
          <FieldRow>
            <Field label="Priority" labelStyle="caps">
              <Select><option>High</option><option>Medium</option><option>Low</option></Select>
            </Field>
            <Field label="Due date" labelStyle="caps"><DateInput /></Field>
          </FieldRow>
          <SegmentedTabs label="Demo" tabs={[{ id: 'a', label: 'Password' }, { id: 'b', label: 'Sign up' }]} value={tab} onChange={setTab} />
        </div>
      </section>

      <section className={styles.section}>
        <h2>Badges and identity</h2>
        <div className={styles.row}>
          <Badge tone="high">High</Badge>
          <Badge tone="medium">Medium</Badge>
          <Badge tone="low">Low</Badge>
          <CountPill count={3} />
          <Avatar initial="U" />
          <Logo />
          <Logo size="lg" />
        </div>
      </section>
    </main>
  )
}
