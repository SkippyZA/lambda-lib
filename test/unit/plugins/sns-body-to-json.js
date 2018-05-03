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

  describe('#_castType', () => {
    it('should cast Numbers correctly', () => {
      plugin._castType('Number', '10').should.equal(10)
    })

    it('should cast StringArray correctly', () => {
      plugin._castType('StringArray', '["soccer", "rugby"]').should.deep.equal(['soccer', 'rugby'])
    })

    it('should cast String correctly', () => {
      plugin._castType('String', 'hello').should.equal('hello')
    })
  })

  describe('#_parseAttributes', () => {
    it('should unwrap and cast attributes into key/value store', () => {
      const object = plugin._parseAttributes({
        Test: {
          Type: 'String',
          Value: 'hello'
        },
        TestNumber: {
          Type: 'Number',
          Value: '1234'
        },
        TestArray: {
          Type: 'StringArray',
          Value: '["soccer", "rugby"]'
        }
      })

      object.should.deep.equal({ Test: 'hello', TestNumber: 1234, TestArray: ['soccer', 'rugby'] })
    })
  })
})
