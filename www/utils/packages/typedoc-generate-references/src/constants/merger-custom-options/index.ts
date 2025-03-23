import { FormattingOptionsType } from "types"
import authProviderOptions from "./auth-provider.js"
import fileOptions from "./file.js"
import fulfillmentProviderOptions from "./fulfillment-provider.js"
import helperStepsOptions from "./helper-steps.js"
import medusaConfigOptions from "./medusa-config.js"
import medusaOptions from "./medusa.js"
import notificationOptions from "./notification.js"
import paymentProviderOptions from "./payment-provider.js"
import searchOptions from "./search.js"
import taxProviderOptions from "./tax-provider.js"
import workflowsOptions from "./workflows.js"
import dmlOptions from "./dml.js"
import coreFlowsOptions from "./core-flows.js"
import jsSdkOptions from "./js-sdk.js"
import lockingOptions from "./locking.js"
import cacheOptions from "./cache.js"
import eventOptions from "./event.js"
import fileServiceOptions from "./file-service.js"
import notificationServiceOptions from "./notification-service.js"

const mergerCustomOptions: FormattingOptionsType = {
  ...authProviderOptions,
  ...cacheOptions,
  ...coreFlowsOptions,
  ...dmlOptions,
  ...eventOptions,
  ...fileServiceOptions,
  ...fileOptions,
  ...fulfillmentProviderOptions,
  ...helperStepsOptions,
  ...jsSdkOptions,
  ...lockingOptions,
  ...medusaConfigOptions,
  ...medusaOptions,
  ...notificationServiceOptions,
  ...notificationOptions,
  ...paymentProviderOptions,
  ...searchOptions,
  ...taxProviderOptions,
  ...workflowsOptions,
}

export default mergerCustomOptions
