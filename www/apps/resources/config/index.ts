import { DocsConfig } from "types"
import { globalConfig } from "docs-ui"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

export const config: DocsConfig = {
  ...globalConfig,
  titleSuffix: "Medusa Documentation",
  baseUrl,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  sidebars: [],
  project: {
    title: "Development Resources",
    key: "resources",
  },
  breadcrumbOptions: {
    startItems: [
      {
        title: "Documentation",
        link: baseUrl,
      },
    ],
  },
  logo: `${process.env.NEXT_PUBLIC_BASE_PATH}/images/logo.png`,
}
