import {
  AiAssistantProvider,
  AnalyticsProvider,
  PageLoadingProvider,
  ScrollControllerProvider,
  SiteConfigProvider,
} from "docs-ui"
import SidebarProvider from "./sidebar"
import SearchProvider from "./search"
import { config } from "../config"
import { MainNavProvider } from "./main-nav"

type ProvidersProps = {
  children?: React.ReactNode
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <AnalyticsProvider writeKey={process.env.NEXT_PUBLIC_SEGMENT_API_KEY}>
      <SiteConfigProvider config={config}>
        <PageLoadingProvider>
          <ScrollControllerProvider scrollableSelector="#main">
            <SidebarProvider>
              <MainNavProvider>
                <SearchProvider>
                  <AiAssistantProvider
                    apiUrl={process.env.NEXT_PUBLIC_AI_ASSISTANT_URL || "temp"}
                    websiteId={process.env.NEXT_PUBLIC_AI_WEBSITE_ID || "temp"}
                    recaptchaSiteKey={
                      process.env
                        .NEXT_PUBLIC_AI_API_ASSISTANT_RECAPTCHA_SITE_KEY ||
                      "temp"
                    }
                    chatType="popover"
                  >
                    {children}
                  </AiAssistantProvider>
                </SearchProvider>
              </MainNavProvider>
            </SidebarProvider>
          </ScrollControllerProvider>
        </PageLoadingProvider>
      </SiteConfigProvider>
    </AnalyticsProvider>
  )
}

export default Providers
