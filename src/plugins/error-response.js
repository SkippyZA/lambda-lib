import AbstractLambdaPlugin from './abstract-lambda-plugin'
import PluginHook from '../enums/hooks'
import LambdaType from '../enums/lambda-type'

export default class ErrorResponse extends AbstractLambdaPlugin {
  constructor (defaultErrorResponse) {
    super('errorResponse', LambdaType.API_GATEWAY)
    this._defaultErrorResponse = defaultErrorResponse

    this.addHook(PluginHook.ON_ERROR, this.mapErrorResponse.bind(this))
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
