import { resolve } from "path"
import { MiddlewareFileLoader } from "../middleware-file-loader"

describe("Middleware file loader", () => {
  it("should load routes from the filesystem", async () => {
    const BASE_DIR = resolve(__dirname, "../__fixtures__/routers-middleware")
    const loader = new MiddlewareFileLoader()
    await loader.scanDir(BASE_DIR)

    expect(loader.getBodyParserConfigRoutes()).toMatchInlineSnapshot(`
      [
        {
          "config": {
            "preserveRawBody": true,
          },
          "matcher": "/webhooks",
          "methods": [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS",
            "HEAD",
          ],
        },
        {
          "config": false,
          "matcher": "/webhooks/*",
          "methods": [
            "POST",
          ],
        },
      ]
    `)
    expect(loader.getMiddlewares()).toMatchInlineSnapshot(`
      [
        {
          "handler": [Function],
          "matcher": "/customers",
          "methods": undefined,
        },
        {
          "handler": [Function],
          "matcher": "/customers",
          "methods": [
            "POST",
          ],
        },
        {
          "handler": [Function],
          "matcher": "/store/*",
          "methods": undefined,
        },
        {
          "handler": [Function],
          "matcher": "/webhooks/*",
          "methods": [
            "POST",
          ],
        },
      ]
    `)
  })
})
