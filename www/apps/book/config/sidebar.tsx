import type { SidebarConfig } from "@/types"
import { generatedSidebar } from "../generated/sidebar.mjs"
import { SidebarItem } from "types"

export const sidebarConfig: SidebarConfig = {
  default: generatedSidebar as SidebarItem[],
  mobile: [],
}
