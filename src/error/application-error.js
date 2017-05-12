/**
 * Base error.
 *
 * By extending this class, any lambda decorator will be able to
 * handle exception at a handler level.
 */
export default class HttpError extends Error {
  constructor (message, httpStatusCode) {
    const msg = message || 'Unknown error'

    super(msg)

    this.name = this.constructor.name
    this.statusCode = httpStatusCode || 500
  }
}
