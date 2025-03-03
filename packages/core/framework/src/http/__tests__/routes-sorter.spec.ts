import { RoutesSorter } from "../routes-sorter"

describe("Routes sorter", () => {
  it("should sort the given routes", () => {
    const sorter = new RoutesSorter([
      {
        matcher: "/v1",
        methods: ["GET"],
        handler: () => {},
      },
      {
        matcher: "/admin/products",
        methods: ["GET"],
        handler: () => {},
      },
      {
        matcher: "/admin/products",
        methods: ["GET"],
        isAppRoute: true,
        handler: () => {},
      },
      {
        matcher: "/admin/products/export",
        methods: ["GET"],
        handler: () => {},
      },
      {
        matcher: "/admin/products",
        isAppRoute: true,
        methods: ["POST"],
        handler: () => {},
      },
      {
        matcher: "/admin/products/:id",
        methods: ["GET"],
        handler: () => {},
      },
      {
        matcher: "/admin/products/batch",
        methods: ["GET"],
        handler: () => {},
      },
      {
        matcher: "/admin/products/*",
        methods: ["GET"],
        handler: () => {},
      },
      {
        matcher: "/admin/(products|collections)",
        methods: ["POST"],
        handler: () => {},
      },
      {
        matcher: "/admin/*",
        methods: ["GET"],
        handler: () => {},
      },
      {
        matcher: "/admin/:id/export",
        methods: ["GET"],
        handler: () => {},
      },
      {
        matcher: "/admin/*/export",
        methods: ["GET"],
        handler: () => {},
      },
    ])

    expect(sorter.sort()).toMatchInlineSnapshot(`
      [
        {
          "handler": [Function],
          "matcher": "/v1",
          "methods": [
            "GET",
          ],
        },
        {
          "handler": [Function],
          "matcher": "/admin/*",
          "methods": [
            "GET",
          ],
        },
        {
          "handler": [Function],
          "matcher": "/admin/*/export",
          "methods": [
            "GET",
          ],
        },
        {
          "handler": [Function],
          "matcher": "/admin/(products|collections)",
          "methods": [
            "POST",
          ],
        },
        {
          "handler": [Function],
          "matcher": "/admin/products",
          "methods": [
            "GET",
          ],
        },
        {
          "handler": [Function],
          "isAppRoute": true,
          "matcher": "/admin/products",
          "methods": [
            "GET",
          ],
        },
        {
          "handler": [Function],
          "isAppRoute": true,
          "matcher": "/admin/products",
          "methods": [
            "POST",
          ],
        },
        {
          "handler": [Function],
          "matcher": "/admin/products/*",
          "methods": [
            "GET",
          ],
        },
        {
          "handler": [Function],
          "matcher": "/admin/products/export",
          "methods": [
            "GET",
          ],
        },
        {
          "handler": [Function],
          "matcher": "/admin/products/batch",
          "methods": [
            "GET",
          ],
        },
        {
          "handler": [Function],
          "matcher": "/admin/products/:id",
          "methods": [
            "GET",
          ],
        },
        {
          "handler": [Function],
          "matcher": "/admin/:id/export",
          "methods": [
            "GET",
          ],
        },
      ]
    `)
  })

  it("should handle all regex based routes", () => {
    const sorter = new RoutesSorter([
      {
        matcher: "/admin/:id/export",
        methods: ["GET"],
        handler: () => {},
      },
      {
        matcher: "/admin/*/export",
        methods: ["GET"],
        handler: () => {},
      },
      {
        matcher: "/admin/products",
        methods: ["GET"],
        handler: () => {},
      },
      {
        matcher: "/admin/pr*ts",
        methods: ["GET"],
        handler: () => {},
      },
      {
        matcher: "/admin/product(collection)?s",
        methods: ["GET"],
        handler: () => {},
      },
    ])

    expect(sorter.sort()).toMatchInlineSnapshot(`
      [
        {
          "handler": [Function],
          "matcher": "/admin/*/export",
          "methods": [
            "GET",
          ],
        },
        {
          "handler": [Function],
          "matcher": "/admin/pr*ts",
          "methods": [
            "GET",
          ],
        },
        {
          "handler": [Function],
          "matcher": "/admin/product(collection)?s",
          "methods": [
            "GET",
          ],
        },
        {
          "handler": [Function],
          "matcher": "/admin/products",
          "methods": [
            "GET",
          ],
        },
        {
          "handler": [Function],
          "matcher": "/admin/:id/export",
          "methods": [
            "GET",
          ],
        },
      ]
    `)
  })

  it("should handle routes with multiple params", () => {
    const sorter = new RoutesSorter([
      {
        matcher: "/admin/customers/:id/addresses",
        methods: ["GET"],
        handler: () => {},
      },
      {
        matcher: "/admin/customers/:id",
        methods: ["GET"],
        handler: () => {},
      },
      {
        matcher: "/admin/customers/:id/addresses/:addressId/switch",
        methods: ["GET"],
        handler: () => {},
      },
      {
        matcher: "/admin/customers/:id/addresses/:addressId",
        methods: ["GET"],
        handler: () => {},
      },
    ])

    expect(sorter.sort()).toMatchInlineSnapshot(`
      [
        {
          "handler": [Function],
          "matcher": "/admin/customers/:id",
          "methods": [
            "GET",
          ],
        },
        {
          "handler": [Function],
          "matcher": "/admin/customers/:id/addresses",
          "methods": [
            "GET",
          ],
        },
        {
          "handler": [Function],
          "matcher": "/admin/customers/:id/addresses/:addressId",
          "methods": [
            "GET",
          ],
        },
        {
          "handler": [Function],
          "matcher": "/admin/customers/:id/addresses/:addressId/switch",
          "methods": [
            "GET",
          ],
        },
      ]
    `)
  })
})
