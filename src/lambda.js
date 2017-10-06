import ApplyBody from './plugins/apply-body'
import runHandlerWithMiddleware from './utils/run-handler-with-middleware'

let a = [
  new ApplyBody()
]

function Lambda (options) {
  options = options || {}

  return function (target, key, descriptor) {
    const fn = descriptor.value
    let responseObject = {}

    descriptor.value = runHandlerWithMiddleware(fn, responseObject, a, options)
    return descriptor
  }
}

export default Lambda
