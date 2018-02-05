/* eslint-disable no-unused-expressions */
import { should, expect } from 'chai'
import { ApiGateway, AbstractLambdaPlugin, Enums } from '../../../src'
import SampleCloudwatchEvent from '../../support/sample-cloudwatch-event'

describe('api-gateway decorator', () => {
  before(() => {
    should()
    expect()
  })

  describe('when applied to a class method', () => {
    it('should work with no parameters', (done) => {
      class Test {
        @ApiGateway()
        testMethod (event) {
          return Promise.resolve(event.test)
        }
      }

      const test = new Test()

      test.testMethod({ test: 'test string' }, null, (err, res) => {
        expect(err).to.be.null
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
        testMethod (event) {
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

    // Skipping this test as the test breaks when trying to use @ApiGateway elsewhere as
    // the test plugin is still loaded into the global context
    it.skip('should pass an error throw when thrown in a PRE_REQUEST middleware', (done) => {
      class TestPlugin extends AbstractLambdaPlugin {
        constructor () {
          super('testPlugin', Enums.LambdaType.API_GATEWAY)

          this.addHook(Enums.Hooks.PRE_EXECUTE, this.throwsError.bind(this))
        }

        throwsError () {
          return (a, b, c, d, done) => {
            throw new Error('plugin-error')
          }
        }
      }

      ApiGateway.registerPlugin(new TestPlugin())

      class Test {
        @ApiGateway()
        testMethod (event) {
          console.log('should not execute')
          return { hello: 'world' }
        }
      }

      const test = new Test()

      test.testMethod({ test: 'test string' }, {}, (err, res) => {
        expect(err).to.be.null()
        res.statusCode.should.equal(500)
        done()
      })
    })

    it('should not execute anything if the lambda allows to be warmed and a cloudwatch schedule event invokes it', (done) => {
      class Test {
        @ApiGateway({ allowWarming: true })
        testMethod (event) {
          return Promise.resolve(event.test)
        }
      }

      const test = new Test()

      test.testMethod(SampleCloudwatchEvent, null, (err, res) => {
        expect(err).to.be.null()
        expect(res).to.be.null()

        done()
      })
    })
  })
})
