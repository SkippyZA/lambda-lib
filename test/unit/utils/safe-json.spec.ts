import { safeJson } from '../../../src/utils/safe-json'

describe('safe-json utility method', () => {
  it('should return an object for a valid JSON string', () => {
    const sampleJsonString = '{"hello":"world","test":1000}'
    const obj = safeJson(sampleJsonString)

    obj.should.be.an('object')
  })

  it('should return the original string if it is not valid JSON', () => {
    const sampleString = 'I am not JSON'
    const result = safeJson(sampleString)

    result.should.be.a('string')
    result.should.equal(sampleString)
  })
})
