/** @type {import('types').RawSidebarItem[]} */
export const pluginsSidebar = [
  {
    type: "link",
    title: "Overview",
    path: "/plugins",
  },
  {
    type: "category",
    title: "Guides",
    children: [
      {
        type: "link",
        title: "Wishlist",
        path: "/plugins/guides/wishlist",
        description: "Learn how to build a wishlist plugin.",
      },
    ],
  },
]
