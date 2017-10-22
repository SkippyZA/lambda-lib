import { should, expect } from 'chai'
import Lambda from '../../../src/handlers/lambda'

describe('lambda decorator', () => {
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
  })
})
