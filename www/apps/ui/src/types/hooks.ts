import { PropType } from "./props"

export type HookData = {
  value: string
  type: PropType
  description?: string
}

export type HookDataMap = HookData[]
