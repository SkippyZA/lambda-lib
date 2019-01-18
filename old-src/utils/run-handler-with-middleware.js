import composeMiddleware from './compose-middleware'
import isCloudwatchTrigger from './is-cloudwatch-trigger'
import PluginHook from '../enums/hooks'

export default function runHandlerWithMiddleware (fn, cb, responseObject, registeredPlugins = [], options = {}) {
  /**
   * Run the plugins that have been bound to plugin hooks
   *
   * Signature: (event, context)(hook)(data) => void
   */
  const processPluginsForHook = (event, context) => hook => data => {
    const hookPlugins = registeredPlugins.map(p => p.hooks[hook] || {})
      .filter(p => Object.keys(p).length > 0)
      .map(p => Object.getOwnPropertyNames(p)
        .map(pluginName => {
          const params = options[pluginName] || null
          return p[pluginName](params)
        })
      )
      .reduce((accum, plugins) => {
        let response = [ ...accum ]
        plugins.forEach(p => response.push(p))

        return response
      }, [])

    return composeMiddleware(hookPlugins)(event, responseObject, data, context)
  }

  /**
   * AWS lambda callback handler
   *
   * @param {object} event aws event object
   * @param {object} context lambda context
   * @param {function} callback callback function
   */
  return function (event, context, callback) {
    const processPluginsForEvent = processPluginsForHook(event, context)

    const runInit = processPluginsForEvent(PluginHook.INITIALIZE)
    const runPreExecute = processPluginsForEvent(PluginHook.PRE_EXECUTE)
    const runPostExecute = processPluginsForEvent(PluginHook.POST_EXECUTE)
    const runError = processPluginsForEvent(PluginHook.ON_ERROR)
    const runFinally = () => {
      return processPluginsForEvent(PluginHook.FINALLY)()
        .then(res => {
          delete global.CONTEXT
          return res
        })
    }

    // Skip the invocation if we expecting the event to be a cloudwatch trigger used for
    // warming the lambda
    if ((options.allowWarming || false) && isCloudwatchTrigger(event)) {
      return Promise.resolve(cb(null, null, callback))
    }

    // Execute the middleware stack using the above request and response
    return Promise.resolve()
      .then(() => runInit())
      // Pre-execute plugins
      .then(() => runPreExecute(event))
      // Execute actual handler function
      .then(() => fn.call(this, event))
      // Execute post-execute plugins after the handler has been executed
      .then(response => runPostExecute(response))
      // Execute the callback
      .then(
        () => {
          return Promise.resolve()
            .then(() => runFinally())
            .then(() => cb(null, responseObject, callback))
        },
        err => {
          return Promise.resolve()
            .then(() => runError(err))
            .then(() => runFinally())
            .then(() => cb(err, responseObject, callback))
        }
      )
  }
}
