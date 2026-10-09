import type { ComponentType } from 'react'

export type SectionIcon = ComponentType<{
  size?: number
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'
  className?: string
}>

export interface CheckItem {
  id: string
  label: string
  hint?: string
  /** Position in the 30-45 minute quick pass (1..10). Only one item per group gets one. */
  priority?: number
}

export interface CheckSection {
  id: string
  num: number
  title: string
  icon: SectionIcon
  note?: string
  items: CheckItem[]
}

export type ItemStatus = 'pass' | 'fail'

export type StatusMap = Record<string, ItemStatus>
