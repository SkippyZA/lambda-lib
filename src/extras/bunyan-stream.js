/**
 * Bunyan stream to merge in global context with each log request.
 */
function BunyanStream () {
  this.write = function (logObj) {
    if (typeof (logObj) === 'object') {
      const globalContext = global.CONTEXT || {}
      const logRecord = Object.assign({}, globalContext, logObj)

      // Clean up x-rrid and log as rrid
      if (logRecord['x-rrid']) {
        logRecord['rrid'] = logRecord['x-rrid']
        delete logRecord['x-rrid']
      }

      process.stdout.write(JSON.stringify(logRecord) + '\n')
    }
  }
}

export default BunyanStream
