import {
  SidebarProvider as UiSidebarProvider,
  useScrollController,
} from "docs-ui"
import { sidebars } from "@/config/sidebar"

type SidebarProviderProps = {
  children?: React.ReactNode
}

const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const { scrollableElement } = useScrollController()

  return (
    <UiSidebarProvider
      sidebars={sidebars}
      scrollableElement={scrollableElement}
    >
      {children}
    </UiSidebarProvider>
  )
}

export default SidebarProvider
