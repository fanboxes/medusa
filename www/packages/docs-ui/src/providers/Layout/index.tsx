"use client"

import useResizeObserver from "@react-hook/resize-observer"
import React, { createContext, createRef, useContext, useState } from "react"

export type LayoutProviderContextType = {
  mainContentRef: React.RefObject<HTMLDivElement | null>
  showCollapsedNavbar: boolean
}

export const LayoutProviderContext =
  createContext<LayoutProviderContextType | null>(null)

export type LayoutProviderProps = {
  children: React.ReactNode
  disableResizeObserver?: boolean
}

export const LayoutProvider = ({
  children,
  disableResizeObserver = false,
}: LayoutProviderProps) => {
  const mainContentRef = createRef<HTMLDivElement>()
  const [showCollapsedNavbar, setShowCollapsedNavbar] = useState(false)

  useResizeObserver(mainContentRef as React.RefObject<HTMLDivElement>, () => {
    if (disableResizeObserver || window.innerWidth < 992) {
      setShowCollapsedNavbar(false)
      return
    }
    if (mainContentRef.current) {
      setShowCollapsedNavbar(mainContentRef.current.clientWidth < 992)
    }
  })

  return (
    <LayoutProviderContext.Provider
      value={{ mainContentRef, showCollapsedNavbar }}
    >
      {children}
    </LayoutProviderContext.Provider>
  )
}

export const useLayout = (): LayoutProviderContextType => {
  const context = useContext(LayoutProviderContext)

  if (!context) {
    throw new Error("useLayout must be used inside a LayoutProvider")
  }

  return context
}
