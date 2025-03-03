import { resolve } from "path"
import { MiddlewareFileLoader } from "../middleware-file-loader"

describe("Middleware file loader", () => {
  it("should load routes from the filesystem", async () => {
    const BASE_DIR = resolve(__dirname, "../__fixtures__/routers-middleware")
    const loader = new MiddlewareFileLoader({})
    await loader.scanDir(BASE_DIR)

    expect(loader.getBodyParserConfigRoutes()).toMatchInlineSnapshot(`
      [
        {
          "config": {
            "preserveRawBody": true,
          },
          "matcher": "/webhooks",
          "method": undefined,
        },
        {
          "config": false,
          "matcher": "/webhooks/*",
          "method": "POST",
        },
      ]
    `)
    expect(loader.getMiddlewares()).toMatchInlineSnapshot(`
      [
        {
          "handler": [Function],
          "matcher": "/customers",
          "method": undefined,
        },
        {
          "handler": [Function],
          "matcher": "/customers",
          "method": "POST",
        },
        {
          "handler": [Function],
          "matcher": "/store/*",
          "method": undefined,
        },
        {
          "handler": [Function],
          "matcher": "/webhooks/*",
          "method": "POST",
        },
      ]
    `)
  })
})
