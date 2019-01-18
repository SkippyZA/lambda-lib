import { should, expect } from 'chai'
import Sns from '../../../src/handlers/sns'

describe('sns decorator', () => {
  before(() => {
    should()
    expect()
  })

  describe('when applied to a class method', () => {
    it('should work without any parameters', done => {
      class Test {
        @Sns()
        testFunction (event) {
          return event.body
        }
      }

      const test = new Test()
      const event = {
        Records: [
          {
            Sns: {
              Message: JSON.stringify({ hello: 'world' })
            }
          }
        ]
      }

      test.testFunction(event, null, (err, res) => {
        expect(err).to.be.null()
        res.should.deep.equal({ data: { hello: 'world' } })
        done()
      })
    })
  })
})
