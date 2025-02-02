"use client"

import {
  AiAssistantProvider,
  AiAssistantProviderProps,
  AnalyticsProvider,
  HooksLoader,
  LearningPathProvider,
  NotificationProvider,
  PaginationProvider,
  ScrollControllerProvider,
  SiteConfigProvider,
} from "docs-ui"
import SidebarProvider from "./sidebar"
import SearchProvider from "./search"
import { config } from "../config"
import { MainNavProvider } from "./main-nav"

type ProvidersProps = {
  children?: React.ReactNode
  aiAssistantProps?: Partial<Omit<AiAssistantProviderProps, "children">>
}

const Providers = ({ children, aiAssistantProps = {} }: ProvidersProps) => {
  return (
    <AnalyticsProvider writeKey={process.env.NEXT_PUBLIC_SEGMENT_API_KEY}>
      <SiteConfigProvider config={config}>
        <LearningPathProvider>
          <NotificationProvider>
            <ScrollControllerProvider scrollableSelector="#main">
              <SidebarProvider>
                <PaginationProvider>
                  <MainNavProvider>
                    <SearchProvider>
                      <AiAssistantProvider
                        {...aiAssistantProps}
                        apiUrl={
                          process.env.NEXT_PUBLIC_AI_ASSISTANT_URL || "temp"
                        }
                        websiteId={
                          process.env.NEXT_PUBLIC_AI_WEBSITE_ID || "temp"
                        }
                        recaptchaSiteKey={
                          process.env
                            .NEXT_PUBLIC_AI_API_ASSISTANT_RECAPTCHA_SITE_KEY ||
                          "temp"
                        }
                      >
                        <HooksLoader
                          options={{
                            pageScrollManager: true,
                            currentLearningPath: false,
                          }}
                        >
                          {children}
                        </HooksLoader>
                      </AiAssistantProvider>
                    </SearchProvider>
                  </MainNavProvider>
                </PaginationProvider>
              </SidebarProvider>
            </ScrollControllerProvider>
          </NotificationProvider>
        </LearningPathProvider>
      </SiteConfigProvider>
    </AnalyticsProvider>
  )
}

export default Providers
