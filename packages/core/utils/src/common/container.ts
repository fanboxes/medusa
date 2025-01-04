export const ContainerRegistrationKeys = {
  PG_CONNECTION: "__pg_connection__",
  MANAGER: "manager",
  CONFIG_MODULE: "configModule",
  LOGGER: "logger",
  REMOTE_QUERY: "remoteQuery",
  QUERY: "query",
  /**
   * @deprecated. Instead use "ContainerRegistrationKeys.LINK"
   */
  REMOTE_LINK: "remoteLink",
  LINK: "link",
  FEATURE_FLAG_ROUTER: "featureFlagRouter",
} as const
