import { DocsConfig, Sidebar } from "types"
import { globalConfig } from "docs-ui"
import { generatedSidebars } from "../generated/sidebar.mjs"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

export const config: DocsConfig = {
  ...globalConfig,
  titleSuffix: "Medusa Documentation",
  baseUrl,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  sidebars: generatedSidebars as Sidebar.Sidebar[],
  project: {
    title: "Documentation",
    key: "book",
  },
  logo: `${process.env.NEXT_PUBLIC_BASE_PATH}/images/logo.png`,
  breadcrumbOptions: {
    startItems: [
      {
        title: "Documentation",
        link: "/",
      },
    ],
  },
}
