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
    // Clone event object
    const requestEvent = JSON.parse(JSON.stringify(event))
    requestEvent.body = safeJson(requestEvent.body)

    // Execute the middleware stack using the above request and response
    const processPluginsForHook = (hook, error) => registeredPlugins
      .forEach(plugin => {
        const pluginsForHook = plugin.hooks[hook] || {}

        Object.getOwnPropertyNames(pluginsForHook)
          .forEach(pluginName => {
            const params = options[pluginName] || null
            const pluginFn = pluginsForHook[pluginName](params)

            pluginFn(requestEvent, responseObject, error, context)
          })
      })

    return Promise.resolve()
      .then(() => processPluginsForHook(PluginHook.PRE_EXECUTE))
      .then(() => fn.call(this, event))
      .then(response => processPluginsForHook(PluginHook.POST_EXECUTE, response))
      .catch(err => processPluginsForHook(PluginHook.ON_ERROR, err))
      .then(() => callback(null, responseObject))
      .then(() => processPluginsForHook(PluginHook.FINALLY))
  }
}
