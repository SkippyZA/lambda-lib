import { should } from 'chai'
import { ApiGateway } from '../src/index.js'

describe('api-gateway decorator', () => {
  before(() => {
    should()
  })

  describe('when applied to a class method', () => {
    beforeEach(() => {

    })

    it('should work with no parameters', (done) => {
      class Test {
        @ApiGateway()
        testMethod(event) {
          return Promise.resolve(event.test)
        }
      }

      const test = new Test()

      test.testMethod({ test: 'test string' }, null, (err, res) => {
        res.should.be.an('object')

        res.should.have.property('headers')
        res.should.have.property('statusCode')
        res.should.have.property('body')

        res.statusCode.should.equal(200)
        res.headers.should.eql({})
        const body = JSON.parse(res.body)
        body.should.equal('test string')

        done()
      })
    })

    it('should expose the default signature (event, context, callback)')
  })
})
