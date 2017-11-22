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

    const decorator = function (options) {
      options = options || {}

      return function (target, key, descriptor) {
        const fn = descriptor.value

        descriptor.value = runHandlerWithMiddleware(fn, thiz._callbackHandler.bind(thiz), thiz.responseObject, thiz.registeredPlugins, options)
        return descriptor
      }
    }

    decorator.registerPlugin = this.registerPlugin.bind(this)
    return decorator
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

  _callbackHandler (err, res, cb) {
    cb(err, res)
  }
}

export default AbstractHandler
