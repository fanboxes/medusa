/** @type {import('types').RawSidebarItem[]} */
export const currencySidebar = [
  {
    type: "category",
    title: "Currency Module",
    isChildSidebar: true,
    children: [
      {
        type: "link",
        path: "/commerce-modules/currency",
        title: "Overview",
      },
      {
        type: "separator",
      },
      {
        type: "sub-category",
        title: "Concepts",
        initialOpen: false,
        children: [
          {
            type: "link",
            path: "/commerce-modules/currency/links-to-other-modules",
            title: "Link to Modules",
          },
        ],
      },
      {
        type: "category",
        title: "Server Guides",
        autogenerate_tags: "server+currency",
        initialOpen: false,
        autogenerate_as_ref: true,
        description:
          "Learn how to use the Currency Module in your customizations on the Medusa application server.",
      },
      {
        type: "category",
        title: "Storefront Guides",
        autogenerate_tags: "storefront+currency,-jsSdk",
        initialOpen: false,
        autogenerate_as_ref: true,
        description:
          "Learn how to integrate the Currency Module's features into your storefront.",
      },
      {
        type: "category",
        title: "Admin Guides",
        autogenerate_tags: "admin+currency,-jsSdk",
        initialOpen: false,
        autogenerate_as_ref: true,
        description:
          "Learn how to utilize administative features of the Currency Module.",
      },
      {
        type: "category",
        title: "User Guides",
        autogenerate_tags: "userGuides+currency",
        initialOpen: false,
        autogenerate_as_ref: true,
        description:
          "Learn how to utilize and manage Currency features in the Medusa Admin dashboard.",
      },
      {
        type: "category",
        title: "Workflows",
        autogenerate_tags: "workflow+currency",
        initialOpen: false,
        autogenerate_as_ref: true,
      },
      {
        type: "category",
        title: "Steps",
        autogenerate_tags: "step+currency",
        initialOpen: false,
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
            autogenerate_tags: "jsSdk+storefront+currency",
            autogenerate_as_ref: true,
          },
          {
            type: "sub-category",
            title: "Admin",
            autogenerate_tags: "jsSdk+admin+currency",
            autogenerate_as_ref: true,
          },
        ],
      },
      {
        type: "sub-category",
        title: "References",
        initialOpen: false,
        description:
          "Find references for data models, methods, and more. These are useful for your customizations.",
        children: [
          {
            type: "link",
            path: "/references/currency",
            title: "Main Service Reference",
            isChildSidebar: true,
            childSidebarTitle: "Currency Module's Main Service Reference",
            children: [
              {
                type: "category",
                title: "Methods",
                autogenerate_path:
                  "/references/currency/ICurrencyModuleService/methods",
              },
            ],
          },
          {
            type: "link",
            path: "/references/currency/models",
            title: "Data Models Reference",
            isChildSidebar: true,
            childSidebarTitle: "Currency Module Data Models Reference",
            children: [
              {
                type: "category",
                title: "Data Models",
                autogenerate_path: "/references/currency_models/variables",
              },
            ],
          },
        ],
      },
    ],
  },
]
