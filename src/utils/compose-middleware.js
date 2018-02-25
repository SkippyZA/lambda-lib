const isFunction = fn => typeof fn === 'function'

export default function composeMiddleware (middleware, logger) {
  if (!Array.isArray(middleware)) {
    throw new TypeError('Stack must be an array')
  }

  for (const fn of middleware) {
    if (!isFunction(fn.fn) || typeof fn.name !== 'string') {
      throw new TypeError('Middleware must be composed of functions { name, fn }')
    }
  }

  return function () {
    const args = [].slice.call(arguments)
    const next = args.slice(-1)[0]

    // last called middleware #
    let index = -1

    function dispatch (i) {
      if (i <= index) {
        return Promise.reject(new Error('next() called multiple times'))
      }

      index = i

      let fn = (middleware[i] || {}).fn
      let fnName = (middleware[i] || {}).name

      if (i === middleware.length) {
        fn = next
      }

      if (!fn || !isFunction(fn)) {
        return Promise.resolve()
      }

      return new Promise((resolve, reject) => {
        try {
          logger.trace('Executing middleware function', { plugin: fnName })

          fn(...args, (err) => {
            if (err) {
              return reject(err)
            }

            return resolve(dispatch(i + 1))
          })
        } catch (err) {
          logger.error('Error when executing middleware function', { plugin: fnName })

          return reject(err)
        }
      })
    }

    return dispatch(0)
  }
}
