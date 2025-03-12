/* eslint-disable @typescript-eslint/ban-ts-comment */
import { TightLayout } from "docs-ui"
import NotFoundContent from "./_not-found.mdx"
import Providers from "../providers"
import Footer from "../components/Footer"

const NotFoundPage = () => {
  return (
    <TightLayout footerComponent={<Footer />} ProvidersComponent={Providers}>
      {/* @ts-ignore React v19 doesn't recognize MDX import as component */}
      <NotFoundContent />
    </TightLayout>
  )
}

export default NotFoundPage
