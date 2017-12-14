import LambdaType from '../enums/lambda-type'
import AbstractHandler from './abstract-handler'
import Plugins from '../plugins'

class ApiGatewayHandler extends AbstractHandler {
  constructor () {
    const supportedPlugins = [ LambdaType.API_GATEWAY, LambdaType.GENERIC ]
    const responseObject = { statusCode: 200, headers: {}, body: '' }

    const plugins = [
      new Plugins.ParseBodyToJson(),
      new Plugins.GlobalRequestContext(),
      new Plugins.ApplyApiGatewayBody(),
      new Plugins.Cors(),
      new Plugins.StatusCode(),
      new Plugins.StringifyBody(),
      new Plugins.ErrorStatusCodeMap(),
      new Plugins.ErrorResponse()
    ]

    super(plugins, responseObject, supportedPlugins)
  }

  _callbackHandler (ignoredError, res, cb) {
    cb(null, res)
  }
}

const handler = new ApiGatewayHandler()
export default handler.getDecorator()
