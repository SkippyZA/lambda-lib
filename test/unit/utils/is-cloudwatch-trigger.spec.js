import isCloudwatchTrigger from '../../../src/utils/is-cloudwatch-trigger'
import sampleCloudwatchEvent from '../../support/sample-cloudwatch-event'

describe('isCloudwatchTrigger', () => {
  it('should return true for a cloudwatch event', () => {
    isCloudwatchTrigger(sampleCloudwatchEvent).should.be.true()
  })

  it('should return false for a non-cloudwatch event', () => {
    isCloudwatchTrigger({ invalid: 'event' }).should.be.false()
  })

  it('should return false for invalid paramters', () => {
    isCloudwatchTrigger(undefined).should.be.false()
    isCloudwatchTrigger(null).should.be.false()
    isCloudwatchTrigger(0).should.be.false()
  })
})
