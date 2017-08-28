import { should, expect } from 'chai'
import LambdaHandler from '../src/lambda-handler'
import ApiGateway from '../src/api-gateway'

describe('lambda-handler class decorator', () => {
  before(() => {
    should()
    expect()
  })

  describe('when applied to a class', () => {
    @LambdaHandler
    class Test {
      constructor () {
        this._hello = 'hello world'
      }

      someHandler() {
        return this._hello
      }

      testFunction() {
        return 'test'
      }
    }

    describe('using the newly defined lambdaHandlers property method', () => {
      it('should execute the class methods on the object returned from lambdaHandlers()', () => {
        const t = new Test()
        const handlers = t.lambdaHandlers()

        handlers.should.be.an.object
        t.someHandler().should.equal('hello world')
        t.testFunction().should.equal('test')
      })
    })
  })
})
