import React from "react"
import {
  BrowserProvider,
  ColorModeProvider,
  LayoutProvider,
  LayoutProviderProps,
  MobileProvider,
  ModalProvider,
} from "../../providers"

type RootProvidersProps = {
  children: React.ReactNode
  layoutProviderProps?: Omit<LayoutProviderProps, "children">
}

export const RootProviders = ({
  children,
  layoutProviderProps = {},
}: RootProvidersProps) => {
  return (
    <BrowserProvider>
      <MobileProvider>
        <LayoutProvider {...layoutProviderProps}>
          <ColorModeProvider>
            <ModalProvider>{children}</ModalProvider>
          </ColorModeProvider>
        </LayoutProvider>
      </MobileProvider>
    </BrowserProvider>
  )
}
