export default (logLevel) => {
  const levels = {
    trace: 1,
    debug: 2,
    info: 3,
    warn: 4,
    error: 5,
    none: 100
  }

  const expectedWeight = Object.keys(levels).find(x => x === logLevel.toLowerCase())

  const canPrint = lvl => {
    const levelWeight = Object.keys(levels).find(x => x === lvl.toLowerCase())
    return levelWeight >= expectedWeight
  }

  return {
    trace: x => canPrint('trace') && console.trace(x),
    debug: x => canPrint('debug') && console.log(x),
    info: x => canPrint('info') && console.info(x),
    warn: x => canPrint('warn') && console.warn(x),
    error: x => canPrint('error') && console.error(x)
  }
}
