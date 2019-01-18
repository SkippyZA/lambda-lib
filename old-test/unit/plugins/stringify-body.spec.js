import { should } from 'chai'
import StringifyBodyPlugin from '../../../src/plugins/stringify-body'

describe('stringify-body plugin', () => {
  before(() => {
    should()
  })

  it('should convert a response body from an object to a valid JSON string', (done) => {
    const stringifyBodyPlugin = new StringifyBodyPlugin()
    const plugin = stringifyBodyPlugin.stringifyBody()

    const req = {}
    const res = {
      body: { hello: 'world' }
    }

    plugin(req, res, null, null, () => {
      res.body.should.be.a('string')
      res.body.should.equal('{"hello":"world"}')
      done()
    })
  })

  it('should JSONify a string body', (done) => {
    const stringifyBodyPlugin = new StringifyBodyPlugin()
    const plugin = stringifyBodyPlugin.stringifyBody()

    const req = {}
    const res = {
      body: 'test body string'
    }

    plugin(req, res, null, null, () => {
      res.body.should.be.a('string')
      res.body.should.equal('"test body string"')
      done()
    })
  })
})
