/** @type {import('types').RawSidebarItem[]} */
export const storeSidebar = [
  {
    type: "category",
    title: "Store Module",
    isChildSidebar: true,
    children: [
      {
        type: "link",
        path: "/commerce-modules/store",
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
            path: "/commerce-modules/store/links-to-other-modules",
            title: "Link to Modules",
          },
        ],
      },
      {
        type: "category",
        title: "Server Guides",
        autogenerate_tags: "server+store",
        initialOpen: false,
        autogenerate_as_ref: true,
        description:
          "Learn how to use the Store Module in your customizations on the Medusa application server.",
      },
      {
        type: "category",
        title: "Storefront Guides",
        autogenerate_tags: "storefront+store,-jsSdk",
        initialOpen: false,
        autogenerate_as_ref: true,
        description:
          "Learn how to integrate the Store Module's features into your storefront.",
      },
      {
        type: "category",
        title: "Admin Guides",
        autogenerate_tags: "admin+store,-jsSdk",
        initialOpen: false,
        autogenerate_as_ref: true,
        description:
          "Learn how to utilize administative features of the Store Module.",
      },
      {
        type: "category",
        title: "User Guides",
        autogenerate_tags: "userGuides+store",
        initialOpen: false,
        autogenerate_as_ref: true,
        description:
          "Learn how to utilize and manage Store features in the Medusa Admin dashboard.",
      },
      {
        type: "category",
        title: "Workflows",
        autogenerate_tags: "workflow+store",
        initialOpen: false,
        autogenerate_as_ref: true,
      },
      {
        type: "category",
        title: "Steps",
        autogenerate_tags: "step+store",
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
            autogenerate_tags: "jsSdk+storefront+store",
            autogenerate_as_ref: true,
          },
          {
            type: "sub-category",
            title: "Admin",
            autogenerate_tags: "jsSdk+admin+store",
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
            path: "/commerce-modules/store/admin-widget-zones",
            title: "Admin Widget Zones",
          },
          {
            type: "link",
            path: "/references/store",
            title: "Main Service Reference",
            isChildSidebar: true,
            childSidebarTitle: "Store Module's Main Service Reference",
            children: [
              {
                type: "category",
                title: "Methods",
                autogenerate_path:
                  "/references/store/IStoreModuleService/methods",
              },
            ],
          },
          {
            type: "link",
            path: "/references/store/models",
            title: "Data Models Reference",
            isChildSidebar: true,
            childSidebarTitle: "Store Module Data Models Reference",
            children: [
              {
                type: "category",
                title: "Data Models",
                autogenerate_path: "/references/store_models/variables",
              },
            ],
          },
        ],
      },
    ],
  },
]
