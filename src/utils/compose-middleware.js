export default function composeMiddleware (middleware) {
  if (!Array.isArray(middleware)) {
    throw new TypeError('Middleware stack must be an array!')
  }

  for (const fn of middleware) {
    if (typeof fn !== 'function') {
      throw new TypeError('Middleware must be composed of functions!')
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

      if (!fn || typeof fn !== 'function') {
        return Promise.resolve()
      }

      try {
        return Promise.resolve(fn(...args, () => dispatch(i + 1)))
      } catch (err) {
        return Promise.reject(err)
      }
    }

    return dispatch(0)
  }
}
