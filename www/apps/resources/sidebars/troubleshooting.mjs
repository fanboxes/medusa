/** @type {import('types').Sidebar.SidebarItem[]} */
export const troubleshootingSidebar = [
  {
    type: "link",
    path: "/troubleshooting",
    title: "Overview",
  },
  {
    type: "separator",
  },
  {
    type: "category",
    title: "Installation",
    initialOpen: true,
    children: [
      {
        type: "link",
        path: "/troubleshooting/create-medusa-app-errors",
        title: "Create Medusa App Errors",
      },
      {
        type: "link",
        path: "/troubleshooting/errors-installing-cli",
        title: "Errors Installing CLI",
      },
      {
        type: "link",
        path: "/troubleshooting/general-errors",
        title: "General Errors",
      },
    ],
  },
  {
    type: "category",
    title: "Medusa Application",
    initialOpen: true,
    children: [
      {
        type: "link",
        path: "/troubleshooting/eaddrinuse",
        title: "EADDRINUSE Error",
      },
      {
        type: "link",
        path: "/troubleshooting/database-errors",
        title: "Database Errors",
      },
      {
        type: "link",
        path: "/troubleshooting/dist-imports",
        title: "Importing from /dist",
      },
      {
        type: "link",
        path: "/troubleshooting/workflow-errors",
        title: "Workflow Errors",
      },
      {
        type: "link",
        path: "/troubleshooting/test-errors",
        title: "Test Errors",
      },
    ],
  },
  {
    type: "category",
    title: "Admin Development",
    initialOpen: true,
    children: [
      {
        type: "link",
        path: "/troubleshooting/medusa-admin/no-widget-route",
        title: "Widget or Route not Showing",
      },
    ],
  },
  {
    type: "category",
    title: "Upgrade",
    initialOpen: true,
    children: [
      {
        type: "link",
        path: "/troubleshooting/errors-after-upgrading",
        title: "Errors After Upgrading",
      },
    ],
  },
  {
    type: "category",
    title: "Frontend",
    initialOpen: true,
    children: [
      {
        type: "link",
        path: "/troubleshooting/cors-errors",
        title: "CORS Errors",
      },
    ],
  },
  {
    type: "category",
    title: "Integrations",
    initialOpen: true,
    children: [
      {
        type: "link",
        path: "/troubleshooting/s3",
        title: "S3 Module Provider Errors",
      },
    ],
  },
]
