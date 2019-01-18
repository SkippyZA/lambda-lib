import { should, expect } from 'chai'
import HandlerController from '../../src/handler-controller'

describe('handler controller class decorator', () => {
  before(() => {
    should()
    expect()
  })

  describe('when applied to a class', () => {
    @HandlerController
    class Test {
      constructor () {
        this._hello = 'hello world'
      }

      someHandler () {
        return this._hello
      }

      testFunction () {
        return 'test'
      }
    }

    describe('using the newly defined lambdaHandlers property method', () => {
      it('should execute the class methods on the object returned from lambdaHandlers()', () => {
        const t = new Test()
        const handlers = t.getHandlers()

        handlers.should.be.an('object')
        t.someHandler().should.equal('hello world')
        t.testFunction().should.equal('test')
      })
    })
  })
})
