import LambdaType from './enums/lambda-type'

import ApplyApiGatewayBody from './plugins/apply-api-gateway-body'
import CorsPlugin from './plugins/cors'
import StatusCodePlugin from './plugins/status-code'
import StringifyBodyPlugin from './plugins/stringify-body'
import ErrorStatusCodeMap from './plugins/error-status-code-map'

import runHandlerWithMiddleware from './utils/run-handler-with-middleware'

let registeredPlugins = []

/**
 * ApiGateway decorator of awesomeness!
 */
function ApiGateway (options) {
  options = options || {}

  /**
   * Decorator code.
   *
   * This is the meat of the decorator. Here we remap the value of the descriptor, which is the function code which
   * should be returning a promise. We run some appropriate middleware based on the arguments supplied, and execute
   * the callback function that is expected by Lambda.
   */
  return function (target, key, descriptor) {
    const fn = descriptor.value
    const responseObject = { statusCode: 200, headers: {}, body: '' }

    descriptor.value = runHandlerWithMiddleware(fn, responseObject, registeredPlugins, options)
    return descriptor
  }
}

ApiGateway.registerPlugin = function (plugin) {
  const isGeneric = plugin.isSupportedType(LambdaType.GENERIC)
  const isApiGateway = plugin.isSupportedType(LambdaType.API_GATEWAY)

  if (!(isGeneric || isApiGateway)) {
    throw new TypeError('Expected plugin to be either `LambdaType.GENERIC` or `LambdaType.API_GATEWAY`')
  }

  registeredPlugins.push(plugin)
}

// Register default plugins
ApiGateway.registerPlugin(new CorsPlugin())
ApiGateway.registerPlugin(new ApplyApiGatewayBody())
ApiGateway.registerPlugin(new StatusCodePlugin())
ApiGateway.registerPlugin(new StringifyBodyPlugin())
ApiGateway.registerPlugin(new ErrorStatusCodeMap())

export default ApiGateway
