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
    title: "Cache Module",
    initialOpen: true,
    children: [
      {
        type: "link",
        path: "/architectural-modules/cache",
        title: "Overview",
      },
      {
        type: "sub-category",
        title: "Modules",
        children: [
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
        ],
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
    title: "Event Module",
    initialOpen: true,
    children: [
      {
        type: "link",
        path: "/architectural-modules/event",
        title: "Overview",
      },
      {
        type: "sub-category",
        title: "Modules",
        children: [
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
        ],
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
    title: "File Module",
    initialOpen: true,
    children: [
      {
        type: "link",
        path: "/architectural-modules/file",
        title: "Overview",
      },
      {
        type: "sub-category",
        title: "Providers",
        children: [
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
        ],
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
    title: "Locking Module",
    initialOpen: true,
    children: [
      {
        type: "link",
        path: "/architectural-modules/locking",
        title: "Overview",
      },
      {
        type: "sub-category",
        title: "Providers",
        children: [
          {
            type: "link",
            path: "/architectural-modules/locking/redis",
            title: "Redis",
          },
          {
            type: "link",
            path: "/architectural-modules/locking/postgres",
            title: "PostgreSQL",
          },
        ],
      },
      {
        type: "sub-category",
        title: "Guides",
        children: [
          {
            type: "link",
            path: "/references/locking-module-provider",
            title: "Create Locking Provider",
          },
          {
            type: "link",
            path: "/references/locking-service",
            title: "Use Locking Module",
          },
        ],
      },
    ],
  },
  {
    type: "category",
    title: "Notification Module",
    initialOpen: true,
    children: [
      {
        type: "link",
        path: "/architectural-modules/notification",
        title: "Overview",
      },
      {
        type: "sub-category",
        title: "Providers",
        children: [
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
        ],
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
            type: "ref",
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
    title: "Workflow Engine Module",
    initialOpen: true,
    children: [
      {
        type: "link",
        path: "/architectural-modules/workflow-engine",
        title: "Overview",
      },
      {
        type: "sub-category",
        title: "Modules",
        children: [
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
    ],
  },
]
