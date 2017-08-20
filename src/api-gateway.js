import ApiGatewayPlugin from './api-gateway-plugin'

import safeJson from './utils/safe-json'
import defaultLogger from './utils/logger'

import CorsPlugin from './plugins/cors'
import StatusCodePlugin from './plugins/status-code'
import StringifyBodyPlugin from './plugins/stringify-body'
import ErrorMapPlugin from './plugins/error-map'

let registeredPlugins = []

/**
 * ApiGateway decorator of awesomeness!
 *
 * statusCode: Default status code to use for a successful response
 * bodySchema: json schema to validate the request body against
 * cors: if set to true, use default global CORS access
 */
function ApiGateway (options) {
  options = options || {}
  const logger = options.logger || defaultLogger(options.logLevel || 'none')

  /**
   * Decorator code.
   *
   * This is the meat of the decorator. Here we remap the value of the descriptor, which is the function code which
   * should be returning a promise. We run some appropriate middleware based on the arguments supplied, and execute
   * the callback function that is expected by Lambda.
   */
  return function (target, key, descriptor) {
    const fn = descriptor.value

    /**
     * Lambda handler code
     */
    descriptor.value = function (event, context, callback) {
      logger.debug('decorator.api-gateway: start')

      // Clone event object
      const requestEvent = JSON.parse(JSON.stringify(event))
      requestEvent.body = safeJson(requestEvent.body)

      // Blank response object
      const responseObject = { statusCode: 200, headers: {}, body: '' }

      // Execute the middleware stack using the above request and response
      const processPluginsForHook = (hook, error) => registeredPlugins
        .forEach(plugin => {
          const pluginsForHook = plugin.hooks[hook] || {}

          Object.getOwnPropertyNames(pluginsForHook)
            .forEach(pluginName => {
              pluginsForHook[pluginName](options[pluginName] || null)(requestEvent, responseObject, error)
            })
        })

      // Start the whole promise chain off using the requestEvent
      Promise.resolve(requestEvent)
        // Run `before` middleware
        .then(e => {
          processPluginsForHook(ApiGatewayPlugin.Hook.PRE_EXECUTE)
          return e
        })
        // Execute handler
        .then(e => fn.apply(this, [e]))
        // Run `after` middleware
        .then(r => {
          responseObject.body = r
          processPluginsForHook(ApiGatewayPlugin.Hook.POST_EXECUTE)
        })
        .catch(err => {
          logger.error(`decorator.api-gateway: error occured. (${err.message})`)
          processPluginsForHook(ApiGatewayPlugin.Hook.ON_ERROR, err)
        })
        // Build up lambda response callback
        .then(() => {
          logger.debug('decorator.api-gateway: response:', responseObject)

          return callback(null, responseObject)
        })
    }

    return descriptor
  }
}

ApiGateway.registerPlugin = function (plugin) {
  registeredPlugins.push(plugin)
}

// Register default plugins
ApiGateway.registerPlugin(new CorsPlugin())
ApiGateway.registerPlugin(new StatusCodePlugin())
ApiGateway.registerPlugin(new StringifyBodyPlugin())
ApiGateway.registerPlugin(new ErrorMapPlugin())

export default ApiGateway
