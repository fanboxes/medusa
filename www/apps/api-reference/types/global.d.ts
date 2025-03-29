import { Sidebar } from "types"

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    analytics?: any
  }
}

export type SidebarItem = Sidebar.SidebarItem & {
  http_method?: string
}
