import LambdaType from '../enums/lambda-type'
import runHandlerWithMiddleware from '../utils/run-handler-with-middleware'

class AbstractHandler {
  constructor (defaultPlugins = [], responseObject = {}) {
    this.responseObject = responseObject
    this.registeredPlugins = [
      ...defaultPlugins
    ]
  }

  getDecorator () {
    const thiz = this

    return options => {
      options = options || {}

      return function (target, key, descriptor) {
        const fn = descriptor.value

        descriptor.value = runHandlerWithMiddleware(fn, thiz.responseObject, thiz.registeredPlugins, options)
        return descriptor
      }
    }
  }

  registerPlugin (plugin) {
    const isGeneric = plugin.isSupportedType(LambdaType.GENERIC)

    if (!isGeneric) {
      throw new TypeError('Expected plugin to be of type `LambdaType.GENERIC`')
    }

    this.registeredPlugins.push(plugin)
  }
}

export default AbstractHandler
