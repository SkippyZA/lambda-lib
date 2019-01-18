import CorsPlugin from '../../../src/plugins/cors'
import { should } from 'chai'

describe('cors plugin', () => {
  before(() => {
    should()
  })

  it('should add headers to an empty header object', (done) => {
    const req = {}
    const res = { statusCode: 200, body: '', headers: {} }

    const cors = new CorsPlugin()
    cors.corsPlugin(true)(req, res, null, {}, () => {
      res.headers['Access-Control-Allow-Origin'].should.equal('*')
      res.headers['Access-Control-Allow-Credentials'].should.equal(true)
      res.headers['Access-Control-Allow-Methods'].should.equal('POST, GET, PUT, PATCH, DELETE, OPTIONS')

      done()
    })
  })

  it('should append CORS headers to an object with existing headers', (done) => {
    const req = {}
    const res = { statusCode: 200, body: '', headers: { 'original-header': 'hello world' } }

    const cors = new CorsPlugin()
    cors.corsPlugin(true)(req, res, null, null, () => {
      res.headers['original-header'].should.equal('hello world')
      res.headers['Access-Control-Allow-Origin'].should.equal('*')
      res.headers['Access-Control-Allow-Credentials'].should.equal(true)
      res.headers['Access-Control-Allow-Methods'].should.equal('POST, GET, PUT, PATCH, DELETE, OPTIONS')
      done()
    })
  })

  it('should not overwrite existing CORS headers', (done) => {
    const req = {}
    const res = { statusCode: 200, body: '', headers: { 'Access-Control-Allow-Methods': 'GET, OPTIONS' } }

    const cors = new CorsPlugin()
    cors.corsPlugin(true)(req, res, null, null, () => {
      res.headers['Access-Control-Allow-Origin'].should.equal('*')
      res.headers['Access-Control-Allow-Credentials'].should.equal(true)
      res.headers['Access-Control-Allow-Methods'].should.equal('GET, OPTIONS')
      done()
    })
  })
})
