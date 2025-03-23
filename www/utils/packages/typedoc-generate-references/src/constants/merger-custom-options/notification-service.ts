import { FormattingOptionsType } from "types"

const notificationServiceOptions: FormattingOptionsType = {
  "^notification_service/.*INotificationModuleService": {
    reflectionGroups: {
      Constructors: false,
    },
    reflectionDescription: `In this document, you’ll learn about the different methods in the Notification Module's service and how to use them.`,
    frontmatterData: {
      slug: "/references/notification-service",
      tags: ["notification", "server", "how to"],
      sidebar_label: "Use Notification Module",
    },
    reflectionTitle: {
      fullReplacement: "How to Use Notification Module",
    },
    expandMembers: true,
    startSections: [
      `## Resolve Notification Module's Service

In your workflow's step, you can resolve the Notification Module's service from the Medusa container:

\`\`\`ts
import { Modules } from "@medusajs/framework/utils"
import { createStep } from "@medusajs/framework/workflows-sdk"

const step1 = createStep(
  "step-1",
  async ({}, { container }) => {
    const notificationModuleService = container.resolve(
      Modules.NOTIFICATION
    )
    
    // TODO use notificationModuleService
  } 
)
\`\`\`

You can then use the Notification Module's service's methods in the step. The rest of this guide details these methods.

---
`,
    ],
  },
}

export default notificationServiceOptions
