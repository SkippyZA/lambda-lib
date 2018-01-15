import isCloudwatchTrigger from '../../../src/utils/is-cloudwatch-trigger.js'

const sampleCloudwatchEvent = {
  id: '53dc4d37-cffa-4f76-80c9-8b7d4a4d2eaa',
  'detail-type': 'Scheduled Event',
  source: 'aws.events',
  account: '123456789012',
  time: '2015-10-08T16:53:06Z',
  region: 'us-east-1',
  resources: [ 'arn:aws:events:us-east-1:123456789012:rule/MyScheduledRule' ],
  detail: {}
}

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
