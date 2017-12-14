import LambdaType from '../enums/lambda-type'
import AbstractHandler from './abstract-handler'
import ApplyApiGatewayBody from '../plugins/apply-api-gateway-body'
import CorsPlugin from '../plugins/cors'
import StatusCodePlugin from '../plugins/status-code'
import StringifyBodyPlugin from '../plugins/stringify-body'
import ErrorStatusCodeMap from '../plugins/error-status-code-map'
import GlobalRequestContext from '../plugins/global-request-context'
import ParseBodyToJson from '../plugins/parse-body-to-json'
import ErrorResponse from '../plugins/error-response'

import defaultErrorResponse from '../utils/default-error-response'

class ApiGatewayHandler extends AbstractHandler {
  constructor () {
    const supportedPlugins = [ LambdaType.API_GATEWAY, LambdaType.GENERIC ]
    const responseObject = { statusCode: 200, headers: {}, body: '' }

    const plugins = [
      new ParseBodyToJson(),
      new GlobalRequestContext(),
      new ApplyApiGatewayBody(),
      new CorsPlugin(),
      new StatusCodePlugin(),
      new StringifyBodyPlugin(),
      new ErrorStatusCodeMap(),
      new ErrorResponse(defaultErrorResponse)
    ]

    super(plugins, responseObject, supportedPlugins)
  }

  _callbackHandler (ignoredError, res, cb) {
    cb(null, res)
  }
}

const handler = new ApiGatewayHandler()
export default handler.getDecorator()
