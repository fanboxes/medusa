import { FormattingOptionsType } from "types"

const fileServiceOptions: FormattingOptionsType = {
  "^file_service/.*IFileModuleService": {
    reflectionGroups: {
      Constructors: false,
    },
    reflectionDescription: `In this document, you’ll learn about the different methods in the File Module's service and how to use them.`,
    frontmatterData: {
      slug: "/references/file-service",
      tags: ["file", "server", "how to"],
      sidebar_label: "Use File Module",
    },
    reflectionTitle: {
      fullReplacement: "How to Use File Module",
    },
    expandMembers: true,
    startSections: [
      `## Resolve File Module's Service

In your workflow's step, you can resolve the File Module's service from the Medusa container:

\`\`\`ts
import { Modules } from "@medusajs/framework/utils"
import { createStep } from "@medusajs/framework/workflows-sdk"

const step1 = createStep(
  "step-1",
  async ({}, { container }) => {
    const fileModuleService = container.resolve(
      Modules.FILE
    )
    
    // TODO use fileModuleService
  } 
)
\`\`\`

You can then use the File Module's service's methods in the step. The rest of this guide details these methods.

---
`,
    ],
  },
}

export default fileServiceOptions
