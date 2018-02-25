import { expect } from 'chai'
import { ApiGateway, ApiGatewayResponse } from '../../../src'

describe('The Api Gateway response object mapper plugin', () => {
  describe('when executing a handler', (done) => {
    it('should work as normal when returning a normal response', () => {
      class TestController {
        @ApiGateway({ statusCode: 201 })
        testFn (event) {
          return {
            test: 'hello world'
          }
        }
      }

      const testController = new TestController()

      testController.testFn({}, {}, (err, res) => {
        expect(err).to.be.null()

        res.should.be.instanceOf(ApiGatewayResponse)

        res.statusCode.should.equal(201)
        res.body.should.equal('{"test":"hello world"}')
        res.headers.should.deep.equal({})
      })
    })

    describe('when returning an instance of ApiGatewayResponse', () => {
      class TestController {
        @ApiGateway({ statusCode: 201 })
        testFn (event) {
          const statusCode = 304
          const body = { test: 'hello world' }

          return new ApiGatewayResponse({ statusCode, body })
        }
      }

      it('should use the status code from the returned ApiGatewayResponse', () => {
        const controller = new TestController()

        const apiGatewayEvent = {
          body: '{"hello":"world"}'
        }

        return controller.testFn(apiGatewayEvent, {}, (err, res) => {
          expect(err).to.be.null()

          res.should.be.instanceOf(ApiGatewayResponse)

          res.statusCode.should.equal(304)
          res.body.should.equal('{"test":"hello world"}')
          res.headers.should.deep.equal({})
        })
      })
    })
  })
})
