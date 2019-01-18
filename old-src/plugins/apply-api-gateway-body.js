import ApiGatewayResponse from '../api-gateway-response'
import AbstractLambdaPlugin from './abstract-lambda-plugin'
import PluginHook from '../enums/hooks'
import LambdaType from '../enums/lambda-type'

export default class ApplyApiGatewayBody extends AbstractLambdaPlugin {
  constructor () {
    super('applyApiGatewayBody', LambdaType.API_GATEWAY)

    this.addHook(PluginHook.POST_EXECUTE, this.applyBody.bind(this))
  }

  applyBody () {
    return (req, res, data, context, done) => {
      if (!(data instanceof ApiGatewayResponse)) {
        res.body = data
      }

      done()
    }
  }
}
