import { should } from 'chai'
import statusCodeMiddleware from '../../src/plugins/status-code'

describe.skip('status-code middleware', () => {
  before(() => {
    should()
  })

  it('should apply the supplied status code', () => {
    const middlewareFn = statusCodeMiddleware(200)
    const req = {}
    const res = { statusCode: 0 }

    const result = middlewareFn(req, res)

    res.statusCode.should.equal(200)
  })

  it('should use the default status code from the response if none supplied', () => {
    const middlewareFn = statusCodeMiddleware()
    const req = {}
    const res = { statusCode: 200 }

    const result = middlewareFn(req, res)
    res.statusCode.should.equal(200)
  })
})
