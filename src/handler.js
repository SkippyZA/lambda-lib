function Handler (options) {
  options = options || {}

  return function (target, key, descriptor) {
    const fn = descriptor.value

    /**
     * Lambda handler code
     */
    descriptor.value = function (event, context, callback) {
      const requestEvent = JSON.parse(JSON.stringify(event))

      Promise.resolve([requestEvent, context])
        .then(([e, c]) => fn.apply(this, [e, c]))
        .then(
          res => callback(null, res),
          err => callback(err)
        )
    }

    return descriptor
  }
}

export default Handler
