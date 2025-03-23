export interface AdminPlugin {
  name: string
}

export interface AdminPluginsListResponse {
  /**
   * The plugin's details.
   */
  plugins: AdminPlugin[]
}
