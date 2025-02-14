import { HookDataMap } from "../types/hooks"

export const useToggleState: HookDataMap = [
  {
    value: "state",
    type: {
      type: "object",
      name: "StateData",
      shape:
        "[\n  state: boolean,\n  open: () => void,\n  close: () => void,\n  toggle: () => void\n]",
    },
  },
]

export const usePrompt: HookDataMap = [
  {
    value: "dialog",
    type: {
      type: "function",
      signature: `async (props: PromptProps): Promise<boolean>`,
    },
    description: "Async function used to display a new confirmation dialog.",
  },
]
