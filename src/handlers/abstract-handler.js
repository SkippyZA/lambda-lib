import LambdaType from '../enums/lambda-type'
import runHandlerWithMiddleware from '../utils/run-handler-with-middleware'

/**
 * AWS Lambda callback
 *
 * @callback awsLambdaCallback
 * @param {Error} error thrown error
 * @param {Object} response response data
 */

/**
 * Abstract handler base class for implementation of lambda handlers.
 */
class AbstractHandler {
  /**
   * AbstractHandler constructor.
   *
   * @param {AbstractLambdaPlugin[]} defaultPlugins list of default plugins for handler
   * @param {Object} responseObject base response object to be passed through plugins
   * @param {LambdaType[]} supportedPluginTypes list of types this plugin supports
   */
  constructor (defaultPlugins = [], responseObject = {}, supportedPluginTypes = [ LambdaType.DEFAULT ]) {
    this.supportedPluginTypes = supportedPluginTypes
    this.responseObject = responseObject
    this.registeredPlugins = [
      ...defaultPlugins
    ]
  }

  /**
   * Get the decorator function.
   *
   * @returns {fn} handler decorator
   */
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

  /**
   * Register a new plugin to the handler.
   *
   * @param {AbstractLambdaPlugin} plugin handler plugin
   * @throws TypeError thrown when invalid plugin used
   */
  registerPlugin (plugin) {
    const isValidPlugin = this.supportedPluginTypes.reduce((accum, type) => {
      return accum || plugin.isSupportedType(type)
    }, false)

    if (!isValidPlugin) {
      throw new TypeError(`Supplied plugin is not supported by this handler.`)
    }

    this.registeredPlugins.push(plugin)
  }

  /**
   * Wrapper around the execution of lambdas callback.
   *
   * @param {Error} err error object
   * @param {Object} res response object
   * @param {awsLambdaCallback} cb aws lambda callback
   */
  _callbackHandler (err, res, cb) {
    return err ? cb(err) : cb(null, res)
  }
}

export default AbstractHandler
