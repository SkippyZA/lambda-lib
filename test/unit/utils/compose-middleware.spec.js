import { expect } from 'chai'
import composeMiddleware from '../../../src/utils/compose-middleware'

const noop = () => {}
const logger = {
  trace: noop,
  debug: noop,
  info: noop,
  error: noop
}

describe('compose middleware', () => {
  describe('with no middleware', () => {
    it('should fail if a non-array supplied', () => {
      expect(() => composeMiddleware(null)).to.throw(TypeError, 'Stack must be an array')
    })

    it('should fail if the array contains non-function values', () => {
      const middleware = [ 'hello', 'world' ]
      expect(() => composeMiddleware(middleware, logger)).to.throw(TypeError, 'Middleware must be composed of functions { name, fn }')
    })

    it('should resolve an empty promise when supplied an empty array', () => {
      return composeMiddleware([], logger)()
    })
  })

  describe('with multiple middleware applied', () => {
    it('execute them with the supplied parameters', () => {
      let executionCount = 0

      const middlewareA = (req, res, done) => {
        req.should.equal('hello')
        res.should.equal('world')
        executionCount++
        done()
      }

      const middlewareB = (req, res, done) => {
        req.should.equal('hello')
        res.should.equal('world')
        executionCount++
        done()
      }

      const middleware = [
        { name: 'testMiddlewareA', fn: middlewareA },
        { name: 'testMiddlewareA', fn: middlewareB }
      ]

      return composeMiddleware(middleware, logger)('hello', 'world')
        .then(() => {
          executionCount.should.equal(2)
        })
    })

    it('should reject the promise if middleware throws an error', () => {
      const middlewareA = (req, res, done) => {
        req.should.equal('hello')
        res.should.equal('world')
        throw new Error('test-error')
      }

      const middleware = [ { name: 'testMiddlewareA', fn: middlewareA } ]

      return composeMiddleware(middleware, logger)('hello', 'world')
        .then(() => {
          throw new Error('Test expected to fail')
        })
        .catch(err => {
          err.message.should.equal('test-error')
        })
    })
  })
})
