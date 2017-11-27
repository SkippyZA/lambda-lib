/**
 * Bunyan stream to merge in global context with each log request.
 */
function BunyanStream () {
  this.write = function (rec) {
    let logObject

    if (typeof (rec) !== 'object') {
      try {
        logObject = JSON.parse(rec)
      } catch (err) {
        console.error('error: raw stream got a non-object record: %j', rec)
        return
      }
    } else {
      logObject = rec
    }

    const globalContext = global.CONTEXT || {}
    const logRecord = Object.assign({}, globalContext, logObject)

    if (logRecord['x-rrid']) {
      logRecord['rrid'] = logRecord['x-rrid']
      delete logRecord['x-rrid']
    }

    process.stdout.write(JSON.stringify(logRecord) + '\n')
  }
}

export default BunyanStream
