import { should, expect } from 'chai'
import Lambda from '../../../src/handlers/lambda'

describe('lambda handler decorator', () => {
  before(() => {
    should()
    expect()
  })

  describe('when applied to a class method', () => {
    it('should work without any parameters', done => {
      class Test {
        @Lambda()
        testFunction () {
          return { hello: 'world' }
        }
      }

      const test = new Test()

      test.testFunction({}, null, (err, res) => {
        expect(err).to.be.null()
        res.should.deep.equal({ data: { hello: 'world' } })
        done()
      })
    })

    it.skip('should call the callback with an error if the promise is rejected', done => {
      class Test {
        @Lambda()
        testFunction () {
          return Promise.reject(new Error('test error'))
        }
      }

      const test = new Test()

      test.testFunction({}, null, (err, res) => {
        expect(res).to.be.null()
        expect(err).to.not.be.null()
        done()
      })
    })
  })
})
