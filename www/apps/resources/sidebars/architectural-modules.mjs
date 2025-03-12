/** @type {import('types').Sidebar.SidebarItem[]} */
export const architecturalModulesSidebar = [
  {
    type: "link",
    path: "/architectural-modules",
    title: "Overview",
  },
  {
    type: "separator",
  },
  {
    type: "category",
    title: "Cache Modules",
    initialOpen: true,
    children: [
      {
        type: "link",
        path: "/architectural-modules/cache",
        title: "Overview",
      },
      {
        type: "link",
        path: "/architectural-modules/cache/in-memory",
        title: "In-Memory",
      },
      {
        type: "link",
        path: "/architectural-modules/cache/redis",
        title: "Redis",
      },
      {
        type: "sub-category",
        title: "Guides",
        children: [
          {
            type: "link",
            path: "/architectural-modules/cache/create",
            title: "Create Cache Module",
          },
        ],
      },
    ],
  },
  {
    type: "category",
    title: "Event Modules",
    initialOpen: true,
    children: [
      {
        type: "link",
        path: "/architectural-modules/event",
        title: "Overview",
      },
      {
        type: "link",
        path: "/architectural-modules/event/local",
        title: "Local",
      },
      {
        type: "link",
        path: "/architectural-modules/event/redis",
        title: "Redis",
      },
      {
        type: "sub-category",
        title: "Guides",
        children: [
          {
            type: "link",
            path: "/architectural-modules/event/create",
            title: "Create Event Module",
          },
        ],
      },
    ],
  },
  {
    type: "category",
    title: "File Module Providers",
    initialOpen: true,
    children: [
      {
        type: "link",
        path: "/architectural-modules/file",
        title: "Overview",
      },
      {
        type: "link",
        path: "/architectural-modules/file/local",
        title: "Local",
      },
      {
        type: "link",
        path: "/architectural-modules/file/s3",
        title: "AWS S3 (and Compatible APIs)",
      },
      {
        type: "sub-category",
        title: "Guides",
        children: [
          {
            type: "link",
            path: "/references/file-provider-module",
            title: "Create File Provider",
          },
        ],
      },
    ],
  },
  {
    type: "category",
    title: "Notification Module Providers",
    initialOpen: true,
    children: [
      {
        type: "link",
        path: "/architectural-modules/notification",
        title: "Overview",
      },
      {
        type: "link",
        path: "/architectural-modules/notification/local",
        title: "Local",
      },
      {
        type: "link",
        path: "/architectural-modules/notification/sendgrid",
        title: "SendGrid",
      },
      {
        type: "sub-category",
        title: "Guides",
        children: [
          {
            type: "link",
            path: "/references/notification-provider-module",
            title: "Create Notification Provider",
          },
          {
            type: "link",
            path: "/integrations/guides/resend",
            title: "Integrate Resend",
          },
          {
            type: "link",
            path: "/architectural-modules/notification/send-notification",
            title: "Send Notification",
          },
        ],
      },
    ],
  },
  {
    type: "category",
    title: "Workflow Engine Modules",
    initialOpen: true,
    children: [
      {
        type: "link",
        path: "/architectural-modules/workflow-engine",
        title: "Overview",
      },
      {
        type: "link",
        path: "/architectural-modules/workflow-engine/in-memory",
        title: "In-Memory",
      },
      {
        type: "link",
        path: "/architectural-modules/workflow-engine/redis",
        title: "Redis",
      },
    ],
  },
]
