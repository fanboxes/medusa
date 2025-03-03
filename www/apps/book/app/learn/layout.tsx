import { TightLayout } from "docs-ui"
import Providers from "../../providers"
import Footer from "../../components/Footer"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TightLayout
      sidebarProps={{
        expandItems: true,
      }}
      ProvidersComponent={Providers}
      footerComponent={<Footer />}
    >
      {children}
    </TightLayout>
  )
}
