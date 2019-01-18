import ApiGatewayResponse from '../api-gateway-response'
import LambdaType from '../enums/lambda-type'
import AbstractHandler from './abstract-handler'
import Plugins from '../plugins'

/**
 * Api gateway response object
 *
 * @typedef {Object} ApiGatewayResponse
 * @type {object}
 * @property {object} headers http headers
 * @property {string} body response body as a JSON string
 * @property {number} statusCode status code
 */

/**
 * Api gateway handler decorator.
 */
class ApiGatewayHandler extends AbstractHandler {
  /**
   * ApiGatewayHandler constructor
   */
  constructor () {
    const supportedPlugins = [ LambdaType.API_GATEWAY, LambdaType.GENERIC ]
    const responseObject = new ApiGatewayResponse({ statusCode: 200, headers: {}, body: '' })

    const plugins = [
      new Plugins.ApiGatewayResponseObjectMapper(),
      new Plugins.ParseBodyToJson(),
      new Plugins.ApplyApiGatewayBody(),
      new Plugins.Cors(),
      new Plugins.StatusCode(),
      new Plugins.StringifyBody(),
      new Plugins.ErrorStatusCodeMap(),
      new Plugins.ErrorResponse()
    ]

    super(plugins, responseObject, supportedPlugins)
  }

  /**
   * Overloading of _callbackHandler to force the response to always be successful, instead
   * of having the error being passed back to the actual lambda callback. The error is being
   * ignore here because `res` should contain the correct response body needed for Api Gateway
   * to render a response
   *
   * @param {Error} ignoredError error object
   * @param {ApiGatewayResponse} res gateway response object
   * @param {awsLambdaCallback} cb aws lambda callback
   */
  _callbackHandler (ignoredError, res, cb) {
    cb(null, res)
  }
}

const handler = new ApiGatewayHandler()
export default handler.getDecorator()
