/** @type {import('types').RawSidebarItem[]} */
export const customerSidebar = [
  {
    type: "category",
    title: "Customer Module",
    isChildSidebar: true,
    children: [
      {
        type: "link",
        path: "/commerce-modules/customer",
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
            path: "/commerce-modules/customer/customer-accounts",
            title: "Customer Accounts",
          },
          {
            type: "link",
            path: "/commerce-modules/customer/links-to-other-modules",
            title: "Link to Modules",
          },
        ],
      },
      {
        type: "category",
        title: "Server Guides",
        autogenerate_tags: "server+customer",
        initialOpen: false,
        autogenerate_as_ref: true,
        description:
          "Learn how to use the Customer Module in your customizations on the Medusa application server.",
        children: [
          {
            type: "link",
            path: "/commerce-modules/customer/extend",
            title: "Extend Module",
          },
        ],
      },
      {
        type: "category",
        title: "Storefront Guides",
        autogenerate_tags: "storefront+customer,-jsSdk",
        initialOpen: false,
        autogenerate_as_ref: true,
        description:
          "Learn how to integrate the Customer Module's features into your storefront.",
      },
      {
        type: "category",
        title: "Admin Guides",
        autogenerate_tags: "admin+customer,-jsSdk",
        initialOpen: false,
        autogenerate_as_ref: true,
        description:
          "Learn how to utilize administative features of the Customer Module.",
      },
      {
        type: "category",
        title: "User Guides",
        autogenerate_tags: "userGuides+customer",
        initialOpen: false,
        autogenerate_as_ref: true,
        description:
          "Learn how to utilize and manage Customer features in the Medusa Admin dashboard.",
      },
      {
        type: "category",
        title: "Workflows",
        autogenerate_tags: "workflow+customer",
        initialOpen: false,
        autogenerate_as_ref: true,
      },
      {
        type: "category",
        title: "Steps",
        autogenerate_tags: "step+customer",
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
            autogenerate_tags: "jsSdk+storefront+customer",
            autogenerate_as_ref: true,
          },
          {
            type: "sub-category",
            title: "Admin",
            autogenerate_tags: "jsSdk+admin+customer",
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
            path: "/commerce-modules/customer/events",
            title: "Events Reference",
          },
          {
            type: "link",
            path: "/commerce-modules/customer/admin-widget-zones",
            title: "Admin Widget Zones",
          },
          {
            type: "link",
            path: "/references/customer",
            title: "Main Service Reference",
            isChildSidebar: true,
            childSidebarTitle: "Customer Module's Main Service Reference",
            children: [
              {
                type: "category",
                title: "Methods",
                autogenerate_path:
                  "/references/customer/ICustomerModuleService/methods",
              },
            ],
          },
          {
            type: "link",
            path: "/references/customer/models",
            title: "Data Models Reference",
            isChildSidebar: true,
            childSidebarTitle: "Customer Module Data Models Reference",
            children: [
              {
                type: "category",
                title: "Data Models",
                autogenerate_path: "/references/customer_models/variables",
              },
            ],
          },
        ],
      },
    ],
  },
]
