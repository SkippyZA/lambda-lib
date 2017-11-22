import LambdaType from '../enums/lambda-type'
import AbstractHandler from './abstract-handler'
import ApplyApiGatewayBody from '../plugins/apply-api-gateway-body'
import CorsPlugin from '../plugins/cors'
import StatusCodePlugin from '../plugins/status-code'
import StringifyBodyPlugin from '../plugins/stringify-body'
import ErrorStatusCodeMap from '../plugins/error-status-code-map'
import GlobalRequestContext from '../plugins/global-request-context'

class ApiGatewayHandler extends AbstractHandler {
  constructor () {
    const supportedPlugins = [ LambdaType.API_GATEWAY, LambdaType.GENERIC ]
    const responseObject = { statusCode: 200, headers: {}, body: '' }
    const plugins = [
      new GlobalRequestContext(),
      new ApplyApiGatewayBody(),
      new CorsPlugin(),
      new StatusCodePlugin(),
      new StringifyBodyPlugin(),
      new ErrorStatusCodeMap()
    ]

    super(plugins, responseObject, supportedPlugins)
  }

  _callbackHandler (ignoredError, res, cb) {
    cb(null, res)
  }
}

const handler = new ApiGatewayHandler()
export default handler.getDecorator()
