import { HookTable } from "@/components/hook-table"
import { usePrompt } from "../../registries/hook-values"

const Props = () => {
  return <HookTable props={usePrompt} />
}

export default Props
