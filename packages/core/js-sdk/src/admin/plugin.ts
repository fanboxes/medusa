import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Plugin {
  private client: Client

  constructor(client: Client) {
    this.client = client
  }

  async list(headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminPluginsListResponse>(
      `/admin/plugins`,
      {
        headers,
        query: {},
      }
    )
  }
}
