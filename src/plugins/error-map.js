import ApiGatewayPlugin from '../api-gateway-plugin'

export default class ErrorMapPlugin extends ApiGatewayPlugin {
  constructor () {
    super('errorMap')

    this.addHook(ApiGatewayPlugin.Hook.ON_ERROR, this.errorMapper.bind(this))
  }

  /**
   * Map errors to custom status codes
   */
  errorMapper (errorMap) {
    return (req, res, error) => {
      res.statusCode = 500
      res.body = JSON.stringify({
        error: {
          message: error.message,
          ...(error || {}),
          _stackTrace: error.stack.split('\n').map(x => x.trim())
        }
      })
    }
  }
}
