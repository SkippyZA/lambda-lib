/**
 * Bunyan serializer which merges the global context into log messages.
 *
 * @param {object} incomingObj incoming bunyan log
 * @return {object} updated bunyan log with global context
 */
export default function bunyanSerializer (incomingObj) {
  if (!incomingObj) {
    return incomingObj
  }

  const globalContext = global.CONTEXT || {}
  return {
    ...globalContext,
    ...incomingObj
  }
}
