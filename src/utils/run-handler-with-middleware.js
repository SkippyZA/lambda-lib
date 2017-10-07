import PluginHook from '../enums/hooks'
import safeJson from './safe-json'

export default function runHandlerWithMiddleware (fn, responseObject, registeredPlugins = [], options = {}) {
  /**
   * AWS lambda callback handler
   *
   * @param {object} event aws event object
   * @param {object} context lambda context
   * @param {function} callback callback function
   */
  return function (event, context, callback) {
    // Execute the middleware stack using the above request and response
    const processPluginsForHook = (hook, data) => registeredPlugins
      .forEach(plugin => {
        const pluginsForHook = plugin.hooks[hook] || {}

        Object.getOwnPropertyNames(pluginsForHook)
          .forEach(pluginName => {
            const params = options[pluginName] || null
            const pluginFn = pluginsForHook[pluginName](params)

            // pluginFn(requestEvent, responseObject, data, context)
            pluginFn(event, responseObject, data, context)
          })
      })

    return Promise.resolve()
      // Pre-execute plugins
      .then(() => processPluginsForHook(PluginHook.PRE_EXECUTE))
      // Execute actual handler function
      .then(() => fn.call(this, event))
      // Execute post-execute plugins after the handler has been executed
      .then(response => processPluginsForHook(PluginHook.POST_EXECUTE, response))
      .catch(err => processPluginsForHook(PluginHook.ON_ERROR, err))
      .then(() => callback(null, responseObject))
      // Finally hook, once everything is complete
      .then(() => processPluginsForHook(PluginHook.FINALLY))
  }
}
