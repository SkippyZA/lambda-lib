const ACCESSOR_FN_NAME = 'getHandlers'

/**
 * Lambda class decorator
 *
 * Marks a class as a lambda handler and adds the additional 'lambdaHandlers'
 * method which returns an object of functions, that when executed, are bound
 * correctly.
 */
function HandlerController (target) {
  /**
   * Build up an object containing all the methods on the object attached.
   *
   * @returns {*}
   */
  function accessorFn () {
    return Object.getOwnPropertyNames(target.prototype)
      .filter(fn => !['constructor', ACCESSOR_FN_NAME].includes(fn))
      .reduce((accum, fn) => {
        return {
          ...accum,
          [fn]: this[fn].bind(this)
        }
      }, {})
  }

  Object.defineProperty(target.prototype, ACCESSOR_FN_NAME, { value: accessorFn })
}

export default HandlerController
