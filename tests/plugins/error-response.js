import { should } from 'chai'
import ErrorResponsePlugin from '../../src/plugins/error-response'

describe('error response plugin', () => {
  before(() => {
    should()
  })

  it('should use the default mapper supplied at initialization', () => {
    let invokeCount = 0

    const errorResponsePlugin = new ErrorResponsePlugin(err => {
      invokeCount++
      err.message.should.equal('Test error message')

      return { hello: 'world' }
    })
    const plugin = errorResponsePlugin.mapErrorResponse(null)

    const req = {}
    const res = { body: '' }

    plugin(req, res, new Error('Test error message'))
    invokeCount.should.equal(1)
    res.body.should.be.equal('{"hello":"world"}')
  })

  it('should use the supplied mapper when run', () => {
    let invokeCount = 0

    const errorResponsePlugin = new ErrorResponsePlugin()
    const plugin = errorResponsePlugin.mapErrorResponse(err => {
      invokeCount++
      err.message.should.equal('Test error message')

      return { hello: 'world' }
    })

    const req = {}
    const res = { body: '' }

    plugin(req, res, new Error('Test error message'))
    invokeCount.should.equal(1)
    res.body.should.be.equal('{"hello":"world"}')
  })

  it('should use the supplied mapper instead of default mapper', () => {
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

    plugin(req, res, new Error('Test error message'))
    invokeFn1.should.equal(0)
    invokeFn2.should.equal(1)
    res.body.should.be.equal('{"hello":"world"}')
  })
})
