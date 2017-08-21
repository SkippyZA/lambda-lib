import ApiGatewayPlugin from '../api-gateway-plugin'

export default class ErrorResponse extends ApiGatewayPlugin {
  constructor () {
    super('errorResponse')

    this.addHook(ApiGatewayPlugin.Hook.ON_ERROR, this.mapErrorResponse.bind(this))
  }

  /**
   * Map error to a custom body
   */
  mapErrorResponse (errorResponseFn) {
    return (req, res, error) => {
      if (!errorResponseFn) {
        return
      }

      const errorBody = errorResponseFn(error)
      res.body = JSON.stringify(errorBody)
    }
  }
}
