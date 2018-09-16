import AbstractLambdaPlugin from './abstract-lambda-plugin'
import PluginHook from '../enums/hooks'
import LambdaType from '../enums/lambda-type'

/**
 * Error status code map definition.
 *
 * @typedef {Object} ErrorStatusCode
 * @type {object}
 * @property {Error} error Error type
 * @property {number} status status code
 */

/**
 * Error status code map.
 *
 * Map an error thrown to an appropariate HTTP status code for ApiGateway
 */
export default class ErrorStatusCodeMap extends AbstractLambdaPlugin {
  /**
   * Error status code map constructor.
   *
   * @param {ErrorStatusCode[]=} statusMap list of errors and their http status codes
   */
  constructor (statusMap = []) {
    super('errorMap', LambdaType.API_GATEWAY)

    this._defaultStatusMap = statusMap
    this.addHook(PluginHook.ON_ERROR, this.errorMapper.bind(this))
  }

  /**
   * Map errors to custom status codes.
   *
   * Using the error, check against a known list of errors and their appropriate status codes to
   * set the api-gateway response status code to. If no mapping found, default to a 500 response
   * code.
   *
   * @param {ErrorStatusCode[]=} errorMap list of errors and their http status codes
   */
  errorMapper (errorMap) {
    errorMap = errorMap || []
    const completeErrorMap = errorMap.concat(this._defaultStatusMap)

    return (req, res, error, context, done) => {
      const err = completeErrorMap.find(e => error.constructor.name === e.error || error.constructor.name === e.error.name)

      res.statusCode = (err && err.status) || 500
      done()
    }
  }
}
