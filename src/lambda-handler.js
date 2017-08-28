/**
 * Lambda class decorator
 *
 * Marks a class as a lambda handler and adds the additional 'lambdaHandlers'
 * method which returns an object of functions, that when executed, are bound
 * correctly.
 */
function LambdaHandler (target) {
  // Add a function to the class that returns
  // the functions as an object
  Object.defineProperty(
    target.prototype,
    'lambdaHandlers',
    {
      value: function () {
        return Object.getOwnPropertyNames(target.prototype)
          .filter(fn => !['constructor', 'lambdaHandlers'].includes(fn))
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

export default LambdaHandler
