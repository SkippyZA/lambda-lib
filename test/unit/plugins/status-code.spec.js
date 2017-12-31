import { should } from 'chai'
import StatusCodePlugin from '../../../src/plugins/status-code'

describe('status-code plugin', () => {
  before(() => {
    should()
  })

  it('should apply the supplied status code', (done) => {
    const statusCode = new StatusCodePlugin()
    const plugin = statusCode.statusCodePlugin(200)

    const req = {}
    const res = { statusCode: 0 }

    plugin(req, res, null, null, () => {
      res.statusCode.should.equal(200)
      done()
    })
  })

  it('should use the default status code from the response if none supplied', (done) => {
    const statusCode = new StatusCodePlugin()
    const plugin = statusCode.statusCodePlugin()

    const req = {}
    const res = { statusCode: 200 }

    plugin(req, res, null, null, () => {
      res.statusCode.should.equal(200)
      done()
    })
  })
})
