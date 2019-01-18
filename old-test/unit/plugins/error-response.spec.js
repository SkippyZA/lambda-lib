import { should } from 'chai'
import ErrorResponsePlugin from '../../../src/plugins/error-response'

describe('error-response plugin', () => {
  before(() => {
    should()
  })

  it('should use the default mapper supplied at initialization', (done) => {
    let invokeCount = 0

    const errorResponsePlugin = new ErrorResponsePlugin(err => {
      invokeCount++
      err.message.should.equal('Test error message')

      return { hello: 'world' }
    })
    const plugin = errorResponsePlugin.mapErrorResponse(null)

    const req = {}
    const res = { body: '' }

    plugin(req, res, new Error('Test error message'), null, () => {
      invokeCount.should.equal(1)
      res.body.should.be.equal('{"hello":"world"}')
      done()
    })
  })

  it('should use the supplied mapper when run', (done) => {
    let invokeCount = 0

    const errorResponsePlugin = new ErrorResponsePlugin()
    const plugin = errorResponsePlugin.mapErrorResponse(err => {
      invokeCount++
      err.message.should.equal('Test error message')

      return { hello: 'world' }
    })

    const req = {}
    const res = { body: '' }

    plugin(req, res, new Error('Test error message'), null, () => {
      invokeCount.should.equal(1)
      res.body.should.be.equal('{"hello":"world"}')
      done()
    })
  })

  it('should use the supplied mapper instead of default mapper', (done) => {
    let invokeFn1 = 0
    let invokeFn2 = 0

    const errorResponsePlugin = new ErrorResponsePlugin(() => {
      invokeFn1++
    })

    const plugin = errorResponsePlugin.mapErrorResponse(err => {
      invokeFn2++
      err.message.should.equal('Test error message')

      return { hello: 'world' }
    })

    const req = {}
    const res = { body: '' }

    plugin(req, res, new Error('Test error message'), null, () => {
      invokeFn1.should.equal(0)
      invokeFn2.should.equal(1)
      res.body.should.be.equal('{"hello":"world"}')

      done()
    })
  })

  describe('when no mapper is supplied', () => {
    it('should use the included format', (done) => {
      const errorResponsePlugin = new ErrorResponsePlugin()
      const plugin = errorResponsePlugin.mapErrorResponse()

      const req = {}
      const res = { body: '' }

      plugin(req, res, new Error('Test error message'), null, () => {
        const body = JSON.parse(res.body)

        body.error.should.exist()
        body.error.message.should.equal('Test error message')
        body.error.name.should.equal('Error')
        body.error._stackTrace.should.exist()
        body.error._stackTrace.should.be.an.instanceOf(Array)

        done()
      })
    })

    it('should use the default values when an invalid error is passed', (done) => {
      const errorResponsePlugin = new ErrorResponsePlugin()
      const plugin = errorResponsePlugin.mapErrorResponse()

      const req = {}
      const res = { body: '' }

      plugin(req, res, { test: 'some invalid error' }, null, () => {
        const body = JSON.parse(res.body)

        body.error.should.exist()
        body.error.message.should.equal('Unknown error. No error specified')
        body.error.name.should.equal('Unknown')
        body.error.test.should.equal('some invalid error')
        body.error._stackTrace.should.exist()
        body.error._stackTrace.should.be.an.instanceOf(Array)

        done()
      })
    })
  })
})
