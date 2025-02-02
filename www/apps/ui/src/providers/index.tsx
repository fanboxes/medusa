"use client"

import {
  AiAssistantProvider,
  AnalyticsProvider,
  ScrollControllerProvider,
  SiteConfigProvider,
} from "docs-ui"
import SearchProvider from "./search"
import SidebarProvider from "./sidebar"
import { siteConfig } from "../config/site"
import { MainNavProvider } from "./main-nav"
import { TooltipProvider } from "@medusajs/ui"

type ProvidersProps = {
  children: React.ReactNode
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <AnalyticsProvider writeKey={process.env.NEXT_PUBLIC_SEGMENT_API_KEY}>
      <SiteConfigProvider config={siteConfig}>
        <ScrollControllerProvider scrollableSelector="#main">
          <SidebarProvider>
            <MainNavProvider>
              <SearchProvider>
                <AiAssistantProvider
                  apiUrl={process.env.NEXT_PUBLIC_AI_ASSISTANT_URL || "temp"}
                  websiteId={process.env.NEXT_PUBLIC_AI_WEBSITE_ID || "temp"}
                  recaptchaSiteKey={
                    process.env
                      .NEXT_PUBLIC_AI_API_ASSISTANT_RECAPTCHA_SITE_KEY || "temp"
                  }
                >
                  <TooltipProvider>{children}</TooltipProvider>
                </AiAssistantProvider>
              </SearchProvider>
            </MainNavProvider>
          </SidebarProvider>
        </ScrollControllerProvider>
      </SiteConfigProvider>
    </AnalyticsProvider>
  )
}

export { Providers }
