import React from "react"
import { RootLayout, RootLayoutProps } from "./root"
import clsx from "clsx"
import { Breadcrumbs } from ".."

export const WideLayout = ({
  children,
  footerComponent,
  showBreadcrumbs = true,
  ...props
}: RootLayoutProps) => {
  return (
    <RootLayout
      {...props}
      mainWrapperClasses={clsx(props.mainWrapperClasses, "mx-auto flex")}
      contentClassName="w-full"
    >
      <main className={clsx("relative mt-4 w-full flex-1 lg:mt-7")}>
        {showBreadcrumbs && <Breadcrumbs />}
        {children}
        {footerComponent}
      </main>
    </RootLayout>
  )
}
