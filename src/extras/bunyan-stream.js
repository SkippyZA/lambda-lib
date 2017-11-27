/**
 * Bunyan stream to merge in global context with each log request.
 */
function BunyanStream () {
  this.write = function (rec) {
    let logObject

    // If we get a non-object, lets try parse it to JSON before erroring out
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

    // Merge the global context in with the log object
    const globalContext = global.CONTEXT || {}
    const logRecord = Object.assign({}, globalContext, logObject)

    // Log x-rrid as rrid
    if (logRecord['x-rrid']) {
      logRecord['rrid'] = logRecord['x-rrid']
      delete logRecord['x-rrid']
    }

    // Write to stdout
    process.stdout.write(JSON.stringify(logRecord) + '\n')
  }
}

export default BunyanStream
