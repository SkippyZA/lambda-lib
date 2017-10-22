import PluginHook from '../enums/hooks'

export default function runHandlerWithMiddleware (fn, responseObject, registeredPlugins = [], options = {}) {
  /**
   * Run the plugins that have been bound to plugin hooks
   *
   * Signature: (hook, event)(data) => void
   */
  const processPluginsForHook = (hook, event) => data => registeredPlugins
    .forEach(plugin => {
      const pluginsForHook = plugin.hooks[hook] || {}

      Object.getOwnPropertyNames(pluginsForHook)
        .forEach(pluginName => {
          const params = options[pluginName] || null
          const pluginFn = pluginsForHook[pluginName](params)

          pluginFn(event, responseObject, data, context)
        })
    })

  /**
   * AWS lambda callback handler
   *
   * @param {object} event aws event object
   * @param {object} context lambda context
   * @param {function} callback callback function
   */
  return function (event, context, callback) {
    const runPreExecute = processPluginsForHook(PluginHook.PRE_EXECUTE, event)
    const runPostExecute = processPluginsForHook(PluginHook.POST_EXECUTE, event)
    const runError = processPluginsForHook(PluginHook.ON_ERROR, event)
    const runFinally = processPluginsForHook(PluginHook.FINALLY, event)

    // Execute the middleware stack using the above request and response
    return Promise.resolve()
      // Pre-execute plugins
      .then(() => runPreExecute())
      // Execute actual handler function
      .then(() => fn.call(this, event))
      // Execute post-execute plugins after the handler has been executed
      .then(response => runPostExecute(response))
      .catch(err => runError(err))
      // Finally hook, once everything is complete
      .then(() => runFinally())
      // Execute the callback
      .then(() => callback(null, responseObject))
  }
}
