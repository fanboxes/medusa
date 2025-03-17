import { FormattingOptionsType } from "types"
import baseSectionsOptions from "../base-section-options.js"

const lockingOptions: FormattingOptionsType = {
  "^locking/.*ILockingProvider": {
    reflectionGroups: {
      Constructors: false,
    },
    reflectionDescription: `In this document, you’ll learn how to create a Locking Module Provider and the methods you must implement in its main service.`,
    frontmatterData: {
      slug: "/references/locking-module-provider",
      tags: ["locking", "server", "how to"],
      sidebar_label: "Create Locking Provider",
    },
    reflectionTitle: {
      fullReplacement: "How to Create a Locking Module Provider",
    },
    shouldIncrementAfterStartSections: true,
    expandMembers: true,
    expandProperties: true,
    sections: {
      ...baseSectionsOptions,
      member_declaration_title: false,
      reflection_typeParameters: false,
    },
    startSections: [
      `## Implementation Example
      
As you implement your Locking Module Provider, it can be useful to refer to an existing provider and how it's implemeted.

If you need to refer to an existing implementation as an example, check the [Redis Locking Module Provider in the Medusa repository](https://github.com/medusajs/medusa/tree/develop/packages/modules/providers/locking-redis).`,
      `## 1. Create Module Provider Directory

Start by creating a new directory for your module provider.

If you're creating the module provider in a Medusa application, create it under the \`src/modules\` directory. For example, \`src/modules/my-locking\`.

If you're creating the module provider in a plugin, create it under the \`src/providers\` directory. For example, \`src/providers/my-locking\`.

<Note>

The rest of this guide always uses the \`src/modules/my-locking\` directory as an example.

</Note>`,
      `## 2. Create the Locking Module Provider Service

Create the file \`src/modules/my-locking/service.ts\` that holds the module provider's main service. It must implement the \`ILockingProvider\` interface imported from \`@medusajs/framework/types\`:

\`\`\`ts title="src/modules/my-locking/service.ts"
import { ILockingProvider } from "@medusajs/framework/types"

type Options = {
  url: string
}

class MyLockingProviderService implements ILockingProvider {
  // TODO implement methods
}

export default MyLockingProviderService
\`\`\``,
    ],
    endSections: [
      `## 3. Create Module Definition File

Create the file \`src/modules/my-locking/index.ts\` with the following content:

\`\`\`ts title="src/modules/my-locking/index.ts"
import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import MyLockingProviderService from "./service"

export default ModuleProvider(Modules.LOCKING, {
  services: [MyLockingProviderService],
})
\`\`\`

This exports the module provider's definition, indicating that the \`MyLockingProviderService\` is the module provider's service.`,
      `## 4. Use Module Provider

To use your Locking Module Provider, add it to the \`providers\` array of the Locking Module in \`medusa-config.ts\`:

\`\`\`ts title="medusa-config.ts"
module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            // if module provider is in a plugin, use \`plugin-name/providers/my-locking\`
            resolve: "./src/modules/my-locking",
            id: "my-lock",
            // set this if you want this provider to be used by default
            // and you have other Locking Module Providers registered.
            is_default: true,
            options: {
              url: "http://example.com",
              // provider options...
            }
          },
        ]
      }
    }
  ]
})
\`\`\`
`,
      `## 5. Test it Out

When you start the Medusa application, if your Locking Module Provider is the only registered provider without enabling \`is_default\`, you'll see the following message:

\`\`\`bash
info:    Locking module: Using "my-lock" as default.
\`\`\`

This indicates that your Locking Module Provider is being used as the default provider.

The Locking Module will now use your provider to handle all locking operations.
`,
      `## Useful Guides

- [How to Use Locking Module](/references/locking-service)
`,
    ],
  },
  "^locking/.*ILockingModule": {
    reflectionGroups: {
      Constructors: false,
    },
    reflectionDescription: `In this document, you’ll learn about the different methods in the Locking Module's service and how to use them.`,
    frontmatterData: {
      slug: "/references/locking-service",
      tags: ["locking", "server", "how to"],
      sidebar_label: "Use Locking Module",
    },
    reflectionTitle: {
      fullReplacement: "How to Use Locking Module",
    },
    expandMembers: true,
    startSections: [
      `## Resolve Locking Module's Service

In your workflow's step, you can resolve the Locking Module's service from the Medusa container:

\`\`\`ts
import { Modules } from "@medusajs/framework/utils"
import { createStep } from "@medusajs/framework/workflows-sdk"

const step1 = createStep(
  "step-1",
  async ({}, { container }) => {
    const lockingModuleService = container.resolve(
      Modules.LOCKING
    )
    
    // TODO use lockingModuleService
  } 
)
\`\`\`

You can then use the Locking Module's service's methods in the step. The rest of this guide details these methods.

---
`,
    ],
  },
}

export default lockingOptions
