import ApplyBody from '../plugins/apply-body'
import runHandlerWithMiddleware from '../utils/run-handler-with-middleware'

let registeredPlugins = [ new ApplyBody() ]

function Lambda (options) {
  options = options || {}

  return function (target, key, descriptor) {
    const fn = descriptor.value
    let responseObject = {}

    descriptor.value = runHandlerWithMiddleware(fn, responseObject, registeredPlugins, options)
    return descriptor
  }
}

export default Lambda
