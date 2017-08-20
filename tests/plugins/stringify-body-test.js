import { should } from 'chai'
import StringifyBodyPlugin from '../../src/plugins/stringify-body'

describe('stringify-body middleware', () => {
  before(() => {
    should()
  })

  it('should convert a response body from an object to a valid JSON string', () => {
    const stringifyBodyPlugin = new StringifyBodyPlugin()
    const plugin = stringifyBodyPlugin.stringifyBody()

    const req = {}
    const res = {
      body: { hello: "world"}
    }

    plugin(req, res)

    res.body.should.be.a('string')
    res.body.should.equal('{"hello":"world"}')
  })

  it('should JSONify a string body', () => {
    const stringifyBodyPlugin = new StringifyBodyPlugin()
    const plugin = stringifyBodyPlugin.stringifyBody()

    const req = {}
    const res = {
      body: 'test body string'
    }

    plugin(req, res)

    res.body.should.be.a('string')
    res.body.should.equal('"test body string"')
  })
})
