import ApiGatewayPlugin from '../api-gateway-plugin'

export default class StringifyBody extends ApiGatewayPlugin {
  constructor () {
    super('stringifyBody')

    this.addHook(ApiGatewayPlugin.Hook.POST_EXECUTE, this.stringifyBody.bind(this))
  }

  /**
   * Stringify the response body
   */
  stringifyBody (statusCode) {
    return (req, res, error) => {
      res.body = JSON.stringify(res.body)
    }
  }
}
