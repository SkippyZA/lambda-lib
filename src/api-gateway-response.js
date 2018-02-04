/**
 * Object wrapper for an ApiGateway response
 */
export default class ApiGatewayResponse {
  /**
   * ApiGatewayResponse constructor.
   *
   * @constructor
   * @param {number} statusCode http status code
   * @param {object} body response body
   * @param {object} headers http response headers
   */
  constructor ({ statusCode = null, body = {}, headers = {} }) {
    this.statusCode = statusCode
    this.body = body
    this.headers = headers
  }
}
