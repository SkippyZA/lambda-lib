const ACCESSOR_FN_NAME = 'getHandlers'

/**
 * Lambda class decorator
 *
 * Marks a class as a lambda handler and adds the additional 'lambdaHandlers'
 * method which returns an object of functions, that when executed, are bound
 * correctly.
 */
function HandlerController (target) {
  // Add a function to the class that returns
  // the functions as an object
  Object.defineProperty(
    target.prototype,
    ACCESSOR_FN_NAME,
    {
      value: function () {
        return Object.getOwnPropertyNames(target.prototype)
          .filter(fn => !['constructor', ACCESSOR_FN_NAME].includes(fn))
          .reduce((accum, fn) => {
            return {
              ...accum,
              [fn]: this[fn].bind(this)
            }
          }, {})
      }
    }
  )
}

export default HandlerController
