/**
 * Default error response
 *
 * @param {Error} err error obj
 * @returns {obj} error response body
 */
export default function defaultErrorResponse (err) {
  const errObj = err || {}
  return {
    error: {
      message: err.message,
      ...errObj,
      _stackTrace: err.stack.split('\n').map(x => x.trim())
    }
  }
}
