import LambdaType from '../enums/lambda-type'

/**
 * Abstract class for lambda handler plugins.
 */
class AbstractLambdaPlugin {
  /**
   * AbstractLambdaPlugin constructor.
   *
   * @params {string} name plugin name
   * @param {string|string[]} supported lambda types
   */
  constructor (name, supportedLambdaTypes = null) {
    this.name = name
    this.hooks = {}

    if (supportedLambdaTypes !== null) {
      if (Array.isArray(supportedLambdaTypes)) {
        this.supportedLambdaTypes = supportedLambdaTypes
      } else {
        this.supportedLambdaTypes = [ supportedLambdaTypes ]
      }
    } else {
      this.supportedLambdaTypes = [ LambdaType.DEFAULT ]
    }
  }

  /**
   * Add hook for plugin.
   *
   * @params {string} hook plugin hook
   * @params {function} plugin function
   */
  addHook (hook, fn) {
    if (!this.hooks[hook]) {
      this.hooks[hook] = {}
    }

    this.hooks[hook][this.name] = fn
  }

  /**
   * Check if this plugin supports the supplied type.
   *
   * @param {string} type lambda type
   * @returns {boolean} returns true if lambda type supported
   */
  isSupportedType (type) {
    return this.supportedLambdaTypes.indexOf(type) > -1
  }

  /**
   * Get a list for the support types for this lambda plugin
   *
   * @returns {LambdaType[]} list of LambdaType
   */
  getSupportedType () {
    return this.supportedLambdaTypes
  }
}

export default AbstractLambdaPlugin
