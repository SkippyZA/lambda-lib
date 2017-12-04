/**
 * Interceptor for axios to include global context properties into each
 * requests headers.
 *
 * Using `global.CONTEXT` which is set by the GlobalContextPlugin, it merges
 * the contents with the request headers
 *
 * @param {object} config Axios config
 * @returns {object} axios config
 */
export default function axiosInterceptor (config) {
  Object.keys(global.CONTEXT || {}).forEach(ctxVar => {
    if (global.CONTEXT[ctxVar] && !config.headers[ctxVar]) {
      config.headers[ctxVar] = global.CONTEXT[ctxVar]
    }
  })

  return config
}
