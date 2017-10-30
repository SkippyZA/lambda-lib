import LambdaType from '../enums/lambda-type'
import runHandlerWithMiddleware from '../utils/run-handler-with-middleware'

class AbstractHandler {
  constructor (defaultPlugins = [], responseObject = {}, supportedPluginTypes = [ LambdaType.GENERIC ]) {
    this.supportedPluginTypes = supportedPluginTypes
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
    const isValidPlugin = this.supportedPluginTypes.reduce((accum, type) => {
      return accum || plugin.isSupportedType(type)
    }, false)

    if (!isValidPlugin) {
      throw new TypeError(`Supplied plugin is not supported by this handler.`)
    }

    this.registeredPlugins.push(plugin)
  }
}

export default AbstractHandler
