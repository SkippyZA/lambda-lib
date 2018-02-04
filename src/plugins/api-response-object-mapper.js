import ApiGatewayResponse from '../api-gateway-response'
import AbstractLambdaPlugin from './abstract-lambda-plugin'
import PluginHook from '../enums/hooks'
import LambdaType from '../enums/lambda-type'

export default class ApiResponseObjectMapper extends AbstractLambdaPlugin {
  constructor () {
    super('apiGatewayResponseObjectMapper', LambdaType.API_GATEWAY)

    this.addHook(PluginHook.POST_EXECUTE, this.responseObjectMapper.bind(this))
  }

  responseObjectMapper () {
    return (req, res, data, context, done) => {
      if (data && data instanceof ApiGatewayResponse) {
        res.statusCode = data.statusCode || res.statusCode
        res.body = data.body || res.body
        res.headers = {
          ...res.headers,
          ...data.headers
        }
      }

      done()
    }
  }
}
