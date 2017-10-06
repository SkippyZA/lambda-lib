import { should, expect } from 'chai'
import Lambda from '../../src/lambda'

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
          return {
            hello: 'world'
          }
        }
      }

      const test = new Test()

      test.testFunction({ test: 'test string' }, null, (err, res) => {
        // res.should.equal('test')
        done()
      })
    })
  })
})
