import { HookTable } from "@/components/hook-table"
import { useToggleState } from "../../registries/hook-values"

const Props = () => {
  return <HookTable props={useToggleState} />
}

export default Props
