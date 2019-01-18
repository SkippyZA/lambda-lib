import CircularJSON from 'circular-json'
import AbstractLambdaPlugin from './abstract-lambda-plugin'
import PluginHook from '../enums/hooks'
import LambdaType from '../enums/lambda-type'

/**
 * Error mapping callback used to format the supplied error into an error response body.
 *
 * @callback errorMapperCallback
 * @param {Error} error thrown error
 * @returns {Object} response body obj
 */

/**
 * ErrorResponse plugin for Api Gateway lambdas.
 */
export default class ErrorResponse extends AbstractLambdaPlugin {
  /**
   * ErrorResponse constructor.
   *
   * @param {errorMapperCallback=} defaultErrorResponse default error response fn
   */
  constructor (defaultErrorResponse = null) {
    super('errorResponse', LambdaType.API_GATEWAY)
    this._defaultErrorResponse = defaultErrorResponse

    this.addHook(PluginHook.ON_ERROR, this.mapErrorResponse.bind(this))
  }

  /**
   * Map error to a custom body
   *
   * @param {errorMapperCallback=} errorResponseFn error response fn
   */
  mapErrorResponse (errorResponseFn = null) {
    const fn = errorResponseFn || this._defaultErrorResponse || null

    return (req, res, error, context, done) => {
      let errorBody

      if (fn !== null) {
        errorBody = fn(error)
      } else {
        const errorObj = error
        const errorType = error && error.constructor && error.constructor.name

        errorBody = {
          error: {
            message: error.message || 'Unknown error. No error specified',
            name: errorType !== 'Object' ? errorType : 'Unknown',
            ...errorObj,
            _stackTrace: (error.stack || '').split('\n').map(x => x.trim())
          }
        }
      }

      res.body = CircularJSON.stringify(errorBody)
      done()
    }
  }
}
