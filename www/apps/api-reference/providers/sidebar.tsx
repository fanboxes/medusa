"use client"

import {
  SidebarProvider as UiSidebarProvider,
  usePageLoading,
  useScrollController,
} from "docs-ui"
import { config } from "../config"

type SidebarProviderProps = {
  children?: React.ReactNode
}

const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const { isLoading, setIsLoading } = usePageLoading()
  const { scrollableElement } = useScrollController()

  return (
    <UiSidebarProvider
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      shouldHandleHashChange={true}
      shouldHandlePathChange={false}
      scrollableElement={scrollableElement}
      sidebars={config.sidebars}
      persistCategoryState={false}
      disableActiveTransition={false}
      isSidebarStatic={false}
    >
      {children}
    </UiSidebarProvider>
  )
}

export default SidebarProvider
