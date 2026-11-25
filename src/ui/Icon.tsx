import plusUrl from '../assets/icons/plus.svg'
import plusWhiteUrl from '../assets/icons/plus-white.svg'
import uploadUrl from '../assets/icons/upload.svg'
import logoMarkUrl from '../assets/icons/logo-mark.svg'
import logoMarkLgUrl from '../assets/icons/logo-mark-lg.svg'
import closeAUrl from '../assets/icons/close-a.svg'
import closeBUrl from '../assets/icons/close-b.svg'
import styles from './Icon.module.css'

// Icons come straight from the Figma file's exported SVGs.

export function PlusIcon({ light = false, size = 16 }: { light?: boolean; size?: number }) {
  return <img className={styles.img} src={light ? plusWhiteUrl : plusUrl} width={size} height={size} alt="" />
}

export function UploadIcon() {
  return <img className={styles.img} src={uploadUrl} width={24} height={24} alt="" />
}

export function LogoMark({ size = 20 }: { size?: 20 | 24 }) {
  return <img className={styles.img} src={size === 24 ? logoMarkLgUrl : logoMarkUrl} width={size} height={size} alt="" />
}

/** 20px close glyph assembled from the two diagonal strokes exported from Figma. */
export function CloseIcon() {
  return (
    <span className={styles.close} aria-hidden="true">
      <span className={styles.stroke}>
        <img src={closeAUrl} alt="" />
      </span>
      <span className={styles.stroke}>
        <img src={closeBUrl} alt="" />
      </span>
    </span>
  )
}

/** Past-due marker (not in the Figma file; stroke follows currentColor). */
export function WarningIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  )
}
