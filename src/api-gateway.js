import safeJson from './safe-json'

/**
 * ApiGateway decorator of awesomeness!
 *
 * statusCode: Default status code to use for a successful response
 * bodySchema: json schema to validate the request body against
 * cors: if set to true, use default global CORS access
 */
function ApiGateway (options) {
  options = options || {}
  const { statusCode, cors } = options
  const DEBUG = options.debug || false

  /**
   * Collection of middleware to be executed `before` and `after` the execution of the middleware function.
   */
  const middlewareStack = {
    before: [],
    after: []
  }

  /**
   * Decorator code.
   *
   * This is the meat of the decorator. Here we remap the value of the descriptor, which is the function code which
   * should be returning a promise. We run some appropriate middleware based on the arguments supplied, and execute
   * the callback function that is expected by Lambda.
   */
  return function (target, key, descriptor) {
    const fn = descriptor.value

    /**
     * Lambda handler code
     */
    descriptor.value = (event, context, callback) => {
      DEBUG && console.log('decorator.api-gateway: start')
      DEBUG && console.log(JSON.stringify(event, '', 2))

      // Clone event object
      const requestEvent = JSON.parse(JSON.stringify(event))
      requestEvent.body = safeJson(requestEvent.body)
      // Blank response object
      const responseObject = { statusCode: 200, headers: {}, body: '' }

      // Execute the middleware stack using the above request and response
      const processMiddlewareStack = stack => stack.forEach(middlewareFn => middlewareFn(requestEvent, responseObject))

      // Start the whole promise chain off using the requestEvent
      Promise.resolve(requestEvent)
        // Run `before` middleware
        .then(e => {
          processMiddlewareStack(middlewareStack.before)
          return e
        })
        // Execute handler
        .then(e => fn(e, context))
        // Run `after` middleware
        .then(r => {
          responseObject.body = r
          processMiddlewareStack(middlewareStack.after)
          return responseObject
        })
        // Build up lambda response callback
        .then(res => {
          DEBUG && console.log('decorator.api-gateway: received result')
          DEBUG && console.log('decorator.api-gateway: response:', res)

          return callback(null, res)
        })
        // Build up an error response for lambda. Apply statusCode if available, else 500 and log the error
        .catch(err => {
          DEBUG && console.error('decorator.api-gateway: we gotz a booboo')
          DEBUG && console.error(err)

          // if (!err.statusCode) {
          //   DEBUG && console.error(`unknown error: ${err.message}`)
          //   return callback(err)
          // }

          return callback(null, {
            statusCode: err.statusCode || 500,
            headers: responseObject.headers,
            body: JSON.stringify({
              error: {
                message: err.message,
                ...(err || {}),
                _stackTrace: err.stack.split('\n').map(x => x.trim())
              }
            })
          })
        })
    }

    return descriptor
  }
}

export default ApiGateway
