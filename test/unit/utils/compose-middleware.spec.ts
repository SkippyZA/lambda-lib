import composeMiddleware from '../../../src/utils/compose-middleware'
import { MiddlewareFunction } from '../../../src/types/middleware'
import { expect } from 'chai'
import { Context } from 'aws-lambda'

const mockContext: Context = {} as Context

describe('Util: composeMiddleware', () => {
  describe('with no middleware', () => {
    it('should resolve an empty promise when supplied an empty array', () => {
      return composeMiddleware([])('', '', {}, mockContext)
    })
  })

  describe('with multiple middleware applied', () => {
    it('execute them with the supplied parameters', async () => {
      let executionCount = 0

      const middlewareA: MiddlewareFunction = (req: any, res: any, event: any, context: any, done: any) => {
        req.should.equal('hello')
        res.should.equal('world')
        executionCount++
        done()
      }

      const middlewareB: MiddlewareFunction = (req: string, res: any, event: any, context: any, done: any) => {
        req.should.equal('hello')
        res.should.equal('world')
        executionCount++
        done()
      }

      const middleware = [ middlewareA, middlewareB ]

      await composeMiddleware(middleware)('hello', 'world', {}, mockContext)

      executionCount.should.equal(2)
    })

    it('should reject the promise if middleware throws an error', async () => {
      const middlewareA = (req: any, res: any) => {
        req.should.equal('hello')
        res.should.equal('world')
        throw new Error('test-error')
      }

      const middleware = [ middlewareA ]

      try {
        await composeMiddleware(middleware)('hello', 'world', {}, mockContext)
        expect.fail('Test expected to fail')
      } catch (err) {
        err.message.should.equal('test-error')
      }
    })
  })
})
