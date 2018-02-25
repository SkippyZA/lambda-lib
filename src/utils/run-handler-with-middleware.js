import composeMiddleware from './compose-middleware'
import isCloudwatchTrigger from './is-cloudwatch-trigger'
import PluginHook from '../enums/hooks'

export default function runHandlerWithMiddleware (fn, cb, responseObject, registeredPlugins = [], options = {}) {
  const logger = (options => {
    if (!options.logger) {
      const log = (level) => (msg, params = {}) => console.log(`${level.toUpperCase()} - ${msg}`, params)

      return {
        trace: log('trace'),
        debug: log('debug'),
        info: log('info'),
        error: log('error')
      }
    }

    return options.logger
  })(options)

  /**
   * Run the plugins that have been bound to plugin hooks
   *
   * Signature: (event, context)(hook)(data) => void
   */
  const processPluginsForHook = (event, context) => hook => data => {
    const pluginsForHook = registeredPlugins
      // Filter out any plugins that dont have the appropriate hooks
      .filter(plugin => Object.getOwnPropertyNames(plugin.hooks).find(p => p === hook))
      // Construct the middleware object of { name, fn } with options applied
      .map(plugin => {
        const { name, hooks } = plugin
        const params = options[name] || null
        const fn = hooks[hook][name](params)

        return { name, fn }
      })

    if (pluginsForHook.length > 0) {
      logger.trace('Filtered plugins to process for hook', { hook, plugins: pluginsForHook.map(p => p.name) })
    } else {
      logger.trace('No plugins to process for hook', { hook })
    }

    return composeMiddleware(pluginsForHook, logger)(event, responseObject, data, context)
  }

  /**
   * AWS lambda callback handler
   *
   * @param {object} event aws event object
   * @param {object} context lambda context
   * @param {function} callback callback function
   */
  return function (event, context, callback) {
    logger.trace('List of registerd plugins', { plugins: registeredPlugins.map(p => p.name) })

    const processPluginsForEvent = processPluginsForHook(event, context)

    const runInit = processPluginsForEvent(PluginHook.INITIALIZE)
    const runPreExecute = processPluginsForEvent(PluginHook.PRE_EXECUTE)
    const runPostExecute = processPluginsForEvent(PluginHook.POST_EXECUTE)
    const runError = processPluginsForEvent(PluginHook.ON_ERROR)
    const runFinally = () => {
      return processPluginsForEvent(PluginHook.FINALLY)()
        .then(res => {
          logger.trace('Clearing global request context properties')
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
      .then(() => {
        logger.trace('Executing handler function', { functionName: fn.name || 'unknown' })
        return fn.call(this, event)
      })
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
