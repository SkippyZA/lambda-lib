import ApiGatewayPlugin from '../api-gateway-plugin'

export default class StatusCode extends ApiGatewayPlugin {
  constructor () {
    super('statusCode')

    this.addHook(ApiGatewayPlugin.Hook.PRE_EXECUTE, this.statusCodePlugin.bind(this))
  }

  /**
   * Apply the status code supplied if the fn response is successful.
   */
  statusCodePlugin (statusCode) {
    return (req, res, error) => {
      res.statusCode = statusCode || res.statusCode
    }
  }
}
