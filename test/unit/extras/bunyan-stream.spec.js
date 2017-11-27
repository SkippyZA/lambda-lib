import sinon from 'sinon'
import { expect } from 'chai'
import BunyanStream from '../../../src/extras/bunyan-stream'

const sandbox = sinon.createSandbox()

describe('bunyan stream', () => {
  beforeEach(() => {
    global.CONTEXT = undefined
    sandbox.spy(process.stdout, 'write')
  })

  afterEach(() => {
    sandbox.restore()
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

      const expectedLogString = '{"x-correlation-id":"some-hash-here","msg":"some log message","hello":"world"}\n'

      const stream = new BunyanStream()
      stream.write(logObj)

      expect(process.stdout.write.calledOnce).to.be.true()
      expect(process.stdout.write.calledWith(expectedLogString)).to.be.true()
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

      const expectedLogString = '{"x-correlation-id":"some-hash-here","x-correlation-test":"log body","msg":"some log message","hello":"world"}\n'

      const stream = new BunyanStream()
      stream.write(logObj)

      expect(process.stdout.write.calledOnce).to.be.true()
      expect(process.stdout.write.calledWith(expectedLogString)).to.be.true()
    })

    it('should print rrid instead of x-rrid', () => {
      global.CONTEXT = {
        'x-correlation-id': 'some-hash-here',
        'x-correlation-test': 'context',
        'x-rrid': 'some-hash-here'
      }

      const logObj = {
        'x-correlation-test': 'log body',
        msg: 'some log message',
        hello: 'world'
      }

      const expectedLogString = '{"x-correlation-id":"some-hash-here","x-correlation-test":"log body","msg":"some log message","hello":"world","rrid":"some-hash-here"}\n'

      const stream = new BunyanStream()
      stream.write(logObj)

      expect(process.stdout.write.calledOnce).to.be.true()
      expect(process.stdout.write.calledWith(expectedLogString)).to.be.true()
    })
  })

  describe('when no global context is set', () => {
    it('should not effect the log contents', () => {
      const logObj = {
        msg: 'some log message',
        hello: 'world'
      }

      const expectedLogString = '{"msg":"some log message","hello":"world"}\n'

      const stream = new BunyanStream()
      stream.write(logObj)

      expect(process.stdout.write.calledOnce).to.be.true()
      expect(process.stdout.write.calledWith(expectedLogString)).to.be.true()
    })
  })
})
