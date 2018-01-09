const isFunction = fn => typeof fn === 'function'

export default function composeMiddleware (middleware) {
  if (!Array.isArray(middleware)) {
    throw new TypeError('Stack must be an array')
  }

  for (const fn of middleware) {
    if (!isFunction(fn)) {
      throw new TypeError('Middleware must be composed of functions')
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

      let fn = middleware[i]
      if (i === middleware.length) {
        fn = next
      }

      if (!fn || !isFunction(fn)) {
        return Promise.resolve()
      }

      return new Promise((resolve, reject) => {
        fn(...args, (err) => {
          if (err) {
            return reject(err)
          }

          return resolve(dispatch(i + 1))
        })
      })
    }

    return dispatch(0)
  }
}
