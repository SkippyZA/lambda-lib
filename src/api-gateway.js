import ApiGatewayPlugin from './api-gateway-plugin'

import safeJson from './utils/safe-json'
import defaultLogger from './utils/logger'
import CorsPlugin from './plugins/cors'
import StatusCodePlugin from './plugins/status-code'
import StringifyBodyPlugin from './plugins/stringify-body'

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
      const processPluginsForHook = hook => registeredPlugins
        .forEach(plugin => {
          const pluginsForHook = plugin.hooks[hook] || {}

          Object.getOwnPropertyNames(pluginsForHook)
            .forEach(pluginName => {
              pluginsForHook[pluginName](options[pluginName] || null)(requestEvent, responseObject)
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
          return responseObject
        })
        // Build up lambda response callback
        .then(res => {
          logger.debug('decorator.api-gateway: received result')
          logger.debug('decorator.api-gateway: response:', res)

          return callback(null, res)
        })
        // Build up an error response for lambda. Apply statusCode if available, else 500 and log the error
        .catch(err => {
          logger.error(`decorator.api-gateway: error occured. (${err.message})`)
          return callback(null, {
            statusCode: err.statusCode || 500,
            headers: responseObject.headers,
            body: JSON.stringify({
              error: {
                message: err.message,
                ...(err || {}),
                _stackTrace: err.stack.split('\n').map(x => x.trim())
              }
            })
          })
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

export default ApiGateway
