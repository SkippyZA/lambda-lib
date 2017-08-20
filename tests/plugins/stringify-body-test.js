import { should } from 'chai'
import stringifyBodyMiddleware from '../../src/plugins/stringify-body'

describe.skip('stringify-body middleware', () => {
  before(() => {
    should()
  })

  it('should convert a response body from an object to a valid JSON string', () => {
    const middleware = stringifyBodyMiddleware()

    const req = {}
    const res = {
      body: { hello: "world"}
    }

    middleware(req, res)

    res.body.should.be.a('string')
    res.body.should.equal('{"hello":"world"}')
  })

  it('should JSONify a string body', () => {
    const middleware = stringifyBodyMiddleware()

    const req = {}
    const res = {
      body: 'test body string'
    }

    middleware(req, res)

    res.body.should.be.a('string')
    res.body.should.equal('"test body string"')
  })
})
