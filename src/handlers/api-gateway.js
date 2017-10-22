import LambdaType from '../enums/lambda-type'
import AbstractHandler from './abstract-handler'
import ApplyApiGatewayBody from '../plugins/apply-api-gateway-body'
import CorsPlugin from '../plugins/cors'
import StatusCodePlugin from '../plugins/status-code'
import StringifyBodyPlugin from '../plugins/stringify-body'
import ErrorStatusCodeMap from '../plugins/error-status-code-map'

class ApiGatewayHandler extends AbstractHandler {
  constructor () {
    const responseObject = { statusCode: 200, headers: {}, body: '' }
    const plugins = [
      new ApplyApiGatewayBody(),
      new CorsPlugin(),
      new StatusCodePlugin(),
      new StringifyBodyPlugin(),
      new ErrorStatusCodeMap()
    ]

    super(plugins, responseObject)
  }

  registerPlugin (plugin) {
    const isApiGateway = plugin.isSupportedType(LambdaType.API_GATEWAY)
    const isGeneric = plugin.isSupportedType(LambdaType.GENERIC)

    if (!isApiGateway && !isGeneric) {
      throw new TypeError('Expected plugin to be of type `LambdaType.GENERIC` or `LambdaType.API_GATEWAY`')
    }

    return super.registerPlugin(plugin)
  }
}

const handler = new ApiGatewayHandler()
export default handler.getDecorator()
