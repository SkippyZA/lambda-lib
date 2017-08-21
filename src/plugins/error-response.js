import ApiGatewayPlugin from '../api-gateway-plugin'

export default class ErrorResponse extends ApiGatewayPlugin {
  constructor (defaultErrorResponse) {
    super('errorResponse')
    this._defaultErrorResponse = defaultErrorResponse

    this.addHook(ApiGatewayPlugin.Hook.ON_ERROR, this.mapErrorResponse.bind(this))
  }

  /**
   * Map error to a custom body
   */
  mapErrorResponse (errorResponseFn) {
    const fn = errorResponseFn || this._defaultErrorResponse || null

    return (req, res, error) => {
      if (fn === null) {
        return
      }

      const errorBody = fn(error)
      res.body = JSON.stringify(errorBody)
    }
  }
}
