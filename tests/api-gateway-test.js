import { should, expect } from 'chai'
import { ApiGateway } from '../src/index.js'

describe('api-gateway decorator', () => {
  before(() => {
    should()
    expect()
  })

  describe('when applied to a class method', () => {
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
        res.body.should.equal('"test string"')

        done()
      })
    })

    it('should return a status code of 500 for an unknown exception', (done) => {
      class Test {
        @ApiGateway()
        testMethod(event) {
          throw new Error('Test')
        }
      }

      const test = new Test()

      test.testMethod({ test: 'test string' }, null, (err, res) => {
        expect(err).to.be.null
        res.statusCode.should.equal(500)

        done()
      })
    })
  })
})
