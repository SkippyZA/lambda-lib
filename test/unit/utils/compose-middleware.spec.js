import composeMiddleware from '../../../src/utils/compose-middleware'

describe('compose middleware', () => {
  describe('with no middleware', () => {
    it('should resolve an empty promise', () => {
      return composeMiddleware([])()
    })
  })

  describe('with multiple middleware applied', () => {
    it('should workd', () => {
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

      const middleware = [ middlewareA, middlewareB ]

      return composeMiddleware(middleware)('hello', 'world')
        .then(() => {
          executionCount.should.equal(2)
        })
    })
  })
})
