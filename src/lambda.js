import LambdaType from './enums/lambda-type'
import runHandlerWithMiddleware from './utils/run-handler-with-middleware'

let registeredPlugins = []

function Lambda (options) {
  options = options || {}

  return function (target, key, descriptor) {
    const fn = descriptor.value
    const responseObject = {}

    descriptor.value = runHandlerWithMiddleware(fn, responseObject, registeredPlugins, options)
    return descriptor
  }
}

export default Lambda
