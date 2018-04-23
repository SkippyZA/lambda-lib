import SnsBodyToJson from '../../../src/plugins/sns-body-to-json'
import { should } from 'chai'

describe('sns-body-to-json plugin', () => {
  let plugin

  before(() => {
    should()
    plugin = new SnsBodyToJson()
  })

  it('it should unwrap SNS event if applicable', (done) => {
    const event = {
      Records: [
        {
          Sns: {
            Message: JSON.stringify({ hello: 'world' })
          }
        }
      ]
    }

    plugin.processRequestBody(true)({}, {}, event, {}, () => {
      event.body.should.deep.equal({ hello: 'world' })
      done()
    })
  })
})
