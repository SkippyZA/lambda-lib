export default (logLevel) => {
  const levels = {
    trace: 1,
    debug: 2,
    info: 3,
    warn: 4,
    error: 5,
    none: 100
  }

  const canPrint = lvl => levels[lvl] >= levels[logLevel]

  return {
    trace: x => canPrint('trace') && console.trace(x),
    debug: x => canPrint('debug') && console.log(x),
    info: x => canPrint('info') && console.info(x),
    warn: x => canPrint('warn') && console.warn(x),
    error: x => canPrint('error') && console.error(x)
  }
}
