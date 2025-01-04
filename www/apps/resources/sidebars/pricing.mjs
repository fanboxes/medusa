/** @type {import('types').RawSidebarItem[]} */
export const pricingSidebar = [
  {
    type: "category",
    title: "Pricing Module",
    isChildSidebar: true,
    children: [
      {
        type: "link",
        path: "/commerce-modules/pricing",
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
            path: "/commerce-modules/pricing/concepts",
            title: "Pricing Concepts",
          },
          {
            type: "link",
            path: "/commerce-modules/pricing/price-rules",
            title: "Price Rules",
          },
          {
            type: "link",
            path: "/commerce-modules/pricing/price-calculation",
            title: "Prices Calculation",
          },
          {
            type: "link",
            path: "/commerce-modules/pricing/tax-inclusive-pricing",
            title: "Tax-Inclusive Pricing",
          },
          {
            type: "link",
            path: "/commerce-modules/pricing/links-to-other-modules",
            title: "Links to Other Modules",
          },
        ],
      },
      {
        type: "category",
        title: "Server Guides",
        autogenerate_tags: "server+pricing",
        initialOpen: false,
        autogenerate_as_ref: true,
        description:
          "Learn how to use the Pricing Module in your customizations on the Medusa application server.",
      },
      {
        type: "category",
        title: "Storefront Guides",
        autogenerate_tags: "storefront+pricing,-jsSdk",
        initialOpen: false,
        autogenerate_as_ref: true,
        description:
          "Learn how to integrate the Pricing Module's features into your storefront.",
      },
      {
        type: "category",
        title: "Admin Guides",
        autogenerate_tags: "admin+pricing,-jsSdk",
        initialOpen: false,
        autogenerate_as_ref: true,
        description:
          "Learn how to utilize administative features of the Pricing Module.",
      },
      {
        type: "category",
        title: "User Guides",
        autogenerate_tags: "userGuides+pricing",
        initialOpen: false,
        autogenerate_as_ref: true,
        description:
          "Learn how to utilize and manage Pricing features in the Medusa Admin dashboard.",
      },
      {
        type: "category",
        title: "Workflows",
        autogenerate_tags: "workflow+pricing",
        initialOpen: false,
        autogenerate_as_ref: true,
      },
      {
        type: "category",
        title: "Steps",
        autogenerate_tags: "step+pricing",
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
            autogenerate_tags: "jsSdk+storefront+pricing",
            autogenerate_as_ref: true,
          },
          {
            type: "sub-category",
            title: "Admin",
            autogenerate_tags: "jsSdk+admin+pricing",
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
            path: "/commerce-modules/pricing/admin-widget-zones",
            title: "Admin Widget Zones",
          },
          {
            type: "link",
            path: "/references/pricing",
            title: "Main Service Reference",
            isChildSidebar: true,
            childSidebarTitle: "Pricing Module's Main Service Reference",
            children: [
              {
                type: "category",
                title: "Methods",
                autogenerate_path:
                  "/references/pricing/IPricingModuleService/methods",
              },
            ],
          },
          {
            type: "link",
            path: "/references/pricing/models",
            title: "Data Models Reference",
            isChildSidebar: true,
            childSidebarTitle: "Pricing Module Data Models Reference",
            children: [
              {
                type: "category",
                title: "Data Models",
                hasTitleStyling: true,
                autogenerate_path: "/references/pricing_models/variables",
              },
            ],
          },
        ],
      },
    ],
  },
]
