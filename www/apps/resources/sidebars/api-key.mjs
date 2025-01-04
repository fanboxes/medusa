/** @type {import('types').RawSidebarItem[]} */
export const apiKeySidebar = [
  {
    type: "category",
    title: "API Key Module",
    isChildSidebar: true,
    children: [
      {
        type: "link",
        path: "/commerce-modules/api-key",
        title: "Overview",
      },
      {
        type: "separator",
      },
      {
        type: "category",
        title: "Concepts",
        initialOpen: false,
        children: [
          {
            type: "link",
            path: "/commerce-modules/api-key/concepts",
            title: "API Key Concepts",
          },
          {
            type: "link",
            path: "/commerce-modules/api-key/links-to-other-modules",
            title: "Link to Modules",
          },
        ],
      },
      {
        type: "category",
        title: "Server Guides",
        autogenerate_tags: "server+auth",
        initialOpen: false,
        autogenerate_as_ref: true,
        description:
          "Learn how to use the API Key Module in your customizations on the Medusa application server.",
      },
      {
        type: "category",
        title: "Storefront Guides",
        initialOpen: false,
        autogenerate_tags: "storefront+apiKey,-jsSdk",
        autogenerate_as_ref: true,
        description:
          "Learn how to integrate the API Key Module's features into your storefront.",
      },
      {
        type: "category",
        title: "Admin Guides",
        initialOpen: false,
        autogenerate_tags: "admin+apiKey,-jsSdk",
        autogenerate_as_ref: true,
        description:
          "Learn how to utilize administative features of the API Key Module.",
      },
      {
        type: "category",
        title: "User Guides",
        initialOpen: false,
        autogenerate_tags: "userGuide+apiKey",
        autogenerate_as_ref: true,
        description:
          "Learn how to utilize and manage API Key features in the Medusa Admin dashboard.",
      },
      {
        type: "category",
        title: "Workflows",
        initialOpen: false,
        autogenerate_tags: "workflow+apiKey",
        autogenerate_as_ref: true,
      },
      {
        type: "category",
        title: "Steps",
        initialOpen: false,
        autogenerate_tags: "step+apiKey",
        autogenerate_as_ref: true,
      },
      {
        type: "category",
        title: "JS SDK",
        initialOpen: false,
        description:
          "The [JS SDK](/js-sdk) allows you to send requests to the Medusa server application from your client applications, such as a storefront or the Medusa Admin dashboard.",
        children: [
          {
            type: "sub-category",
            title: "Store",
            autogenerate_tags: "jsSdk+storefront+apiKey",
            autogenerate_as_ref: true,
          },
          {
            type: "sub-category",
            title: "Admin",
            autogenerate_tags: "jsSdk+admin+apiKey",
            autogenerate_as_ref: true,
          },
        ],
      },
      {
        type: "category",
        title: "References",
        initialOpen: false,
        description:
          "Find references for data models, methods, and more. These are useful for your customizations.",
        children: [
          {
            type: "link",
            path: "/commerce-modules/api-key/admin-widget-zones",
            title: "Admin Widget Zones",
          },
          {
            type: "link",
            path: "/references/api-key",
            title: "Main Service Reference",
            isChildSidebar: true,
            childSidebarTitle: "API Key Module's Main Service Reference",
            children: [
              {
                type: "category",
                title: "Methods",
                hasTitleStyling: true,
                autogenerate_path:
                  "/references/api_key/IApiKeyModuleService/methods",
              },
            ],
          },
          {
            type: "link",
            path: "/references/api-key/models",
            title: "Data Models Reference",
            isChildSidebar: true,
            childSidebarTitle: "API Key Module Data Models Reference",
            children: [
              {
                type: "category",
                title: "Data Models",
                hasTitleStyling: true,
                autogenerate_path: "/references/api_key_models/variables",
              },
            ],
          },
        ],
      },
    ],
  },
]
