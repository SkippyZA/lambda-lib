import { expect } from 'chai'
import ErrorStatusCodeMap from '../../../src/plugins/error-status-code-map'

const SAMPLE_ERROR_MAP = [
  {
    error: TypeError,
    status: 400
  },
  {
    error: ReferenceError,
    status: 404
  }
]

describe('error-status-code map', () => {
  describe('when supplied with an error map', () => {
    let mapFn, req, res

    beforeEach(() => {
      req = {}
      res = {}
      const errorStatusCodeMap = new ErrorStatusCodeMap()
      mapFn = errorStatusCodeMap.errorMapper(SAMPLE_ERROR_MAP)
    })

    it('should correctly map the status to the response statusCode property', () => {
      mapFn(req, res, new ReferenceError('reference error'))
      expect(res.statusCode).to.equal(404)

      mapFn(req, res, new TypeError('some error'))
      expect(res.statusCode).to.equal(400)
    })

    it('should set the statusCode response property to 500 if the error does not match', () => {
      mapFn(req, res, new Error('some error'))
      expect(res.statusCode).to.equal(500)
    })
  })

  describe('when supplied with a global error status code map', () => {
    it('should make use of the global status codes if no local map supplied')
    it('should favour the local mapping status code instead of the global map when errors clash')
  })
})
