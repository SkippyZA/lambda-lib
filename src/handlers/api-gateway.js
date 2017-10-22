import LambdaType from '../enums/lambda-type'
import ApplyApiGatewayBody from '../plugins/apply-api-gateway-body'
import CorsPlugin from '../plugins/cors'
import StatusCodePlugin from '../plugins/status-code'
import StringifyBodyPlugin from '../plugins/stringify-body'
import ErrorStatusCodeMap from '../plugins/error-status-code-map'

import runHandlerWithMiddleware from '../utils/run-handler-with-middleware'

let registeredPlugins = [ new ApplyApiGatewayBody() ]

/**
 * ApiGateway decorator of awesomeness!
 */
function ApiGateway (options) {
  options = options || {}

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
ApiGateway.registerPlugin(new StatusCodePlugin())
ApiGateway.registerPlugin(new StringifyBodyPlugin())
ApiGateway.registerPlugin(new ErrorStatusCodeMap())

export default ApiGateway
