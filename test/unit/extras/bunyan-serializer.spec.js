import BunyanSerializer from '../../../src/extras/bunyan-serializer'

describe('bunyan serializer', () => {
  beforeEach(() => {
    global.CONTEXT = undefined
  })

  describe('when a global context is set', () => {
    it('should merge it with the passed in log obj', () => {
      global.CONTEXT = {
        'x-correlation-id': 'some-hash-here'
      }
      const logObj = {
        msg: 'some log message',
        hello: 'world'
      }

      const patchedLogObj = BunyanSerializer(logObj)

      patchedLogObj.should.deep.equal({
        'x-correlation-id': 'some-hash-here',
        msg: 'some log message',
        hello: 'world'
      })
    })

    it('should favour the log contents instead of the global context', () => {
      global.CONTEXT = {
        'x-correlation-id': 'some-hash-here',
        'x-correlation-test': 'context'
      }

      const logObj = {
        'x-correlation-test': 'log body',
        msg: 'some log message',
        hello: 'world'
      }

      const patchedLogObj = BunyanSerializer(logObj)

      patchedLogObj.should.deep.equal({
        'x-correlation-id': 'some-hash-here',
        'x-correlation-test': 'log body',
        msg: 'some log message',
        hello: 'world'
      })
    })
  })

  describe('when no global context is set', () => {
    it('should not effect the log contents', () => {
      const logObj = {
        msg: 'some log message',
        hello: 'world'
      }

      const patchedLogObj = BunyanSerializer(logObj)

      patchedLogObj.should.deep.equal(logObj)
    })
  })
})
