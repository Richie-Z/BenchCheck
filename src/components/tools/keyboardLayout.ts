import type { SectionIcon } from '../../types'
import {
  MicrophoneSlash,
  Monitor,
  SpeakerHigh,
  SpeakerLow,
  SpeakerX,
  Star,
  Sun,
  SunDim,
  WifiHigh,
} from '@phosphor-icons/react'

export interface KeyDef {
  code: string
  label: string
  units?: number
  gap?: boolean
  half?: boolean
  icon?: SectionIcon
  nub?: boolean
}

const letters = (chars: string): KeyDef[] =>
  chars.split('').map((l) => ({ code: `Key${l}`, label: l }))

const digits = (chars: string): KeyDef[] =>
  chars.split('').map((d) => ({ code: `Digit${d}`, label: d }))

const FN_ICONS: Record<number, SectionIcon> = {
  1: SpeakerX,
  2: SpeakerLow,
  3: SpeakerHigh,
  4: MicrophoneSlash,
  5: SunDim,
  6: Sun,
  7: Monitor,
  8: WifiHigh,
  12: Star,
}

const FN_ROW: KeyDef[] = [
  { code: 'Escape', label: 'Esc', units: 1.1 },
  ...Array.from({ length: 12 }, (_, i) => {
    const n = i + 1
    return {
      code: `F${n}`,
      label: `F${n}`,
      units: 0.8,
      gap: n === 5 || n === 9,
      icon: FN_ICONS[n],
    }
  }),
  { code: 'Home', label: 'Home', units: 0.8, gap: true },
  { code: 'End', label: 'End', units: 0.8 },
  { code: 'Insert', label: 'Ins', units: 0.8 },
  { code: 'Delete', label: 'Del', units: 1.1 },
]

const NUMBER_ROW: KeyDef[] = [
  { code: 'Backquote', label: '`' },
  ...digits('1234567890'),
  { code: 'Minus', label: '-' },
  { code: 'Equal', label: '=' },
  { code: 'Backspace', label: 'Backspace', units: 2 },
]

const QWERTY_ROW: KeyDef[] = [
  { code: 'Tab', label: 'Tab', units: 1.5 },
  ...letters('QWERTYUIOP'),
  { code: 'BracketLeft', label: '[' },
  { code: 'BracketRight', label: ']' },
  { code: 'Backslash', label: '\\', units: 1.5 },
]

const HOME_ROW: KeyDef[] = [
  { code: 'CapsLock', label: 'Caps', units: 1.75 },
  ...letters('ASDFGHJKL'),
  { code: 'Semicolon', label: ';' },
  { code: 'Quote', label: "'" },
  { code: 'Enter', label: 'Enter', units: 2.5 },
]

const SHIFT_ROW: KeyDef[] = [
  { code: 'ShiftLeft', label: 'Shift', units: 2.25 },
  ...letters('ZXCVBNM').map((k) => (k.code === 'KeyB' ? { ...k, nub: true } : k)),
  { code: 'Comma', label: ',' },
  { code: 'Period', label: '.' },
  { code: 'Slash', label: '/' },
  { code: 'ShiftRight', label: 'Shift', units: 3.05 },
]

const MOD_ROW: KeyDef[] = [
  { code: 'ControlLeft', label: 'Ctrl', units: 1.25 },
  { code: 'Fn', label: 'Fn', units: 1 },
  { code: 'MetaLeft', label: 'Win', units: 1 },
  { code: 'AltLeft', label: 'Alt', units: 1 },
  { code: 'Space', label: 'Space', units: 5.25 },
  { code: 'AltRight', label: 'Alt', units: 1 },
  { code: 'PrintScreen', label: 'PrtSc', units: 1 },
  { code: 'ControlRight', label: 'Ctrl', units: 1.25 },
]

export const KEYBOARD_ROWS: KeyDef[][] = [
  FN_ROW,
  NUMBER_ROW,
  QWERTY_ROW,
  HOME_ROW,
  SHIFT_ROW,
  MOD_ROW,
]

export const ARROWS_CLUSTER: KeyDef[][] = [
  [
    { code: 'PageUp', label: 'PgUp', units: 0.9, half: true },
    { code: 'ArrowUp', label: '↑', units: 0.9, half: true },
    { code: 'PageDown', label: 'PgDn', units: 0.9, half: true },
  ],
  [
    { code: 'ArrowLeft', label: '←', units: 0.9, half: true },
    { code: 'ArrowDown', label: '↓', units: 0.9, half: true },
    { code: 'ArrowRight', label: '→', units: 0.9, half: true },
  ],
]

export const TOTAL_KEYS =
  KEYBOARD_ROWS.flat().length + ARROWS_CLUSTER.flat().length
