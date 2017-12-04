import AxiosInterceptor from '../../../src/extras/axios-interceptor'

describe('axios interceptor', () => {
  beforeEach(() => {
    global.CONTEXT = undefined
  })

  it('should not adjust the headers if no global context is available', () => {
    const config = {
      headers: {
        test: 'hello world'
      }
    }

    const patchedConfig = AxiosInterceptor(config)

    patchedConfig.should.deep.equal(config)
  })

  it('should add the global context properties to the headers', () => {
    global.CONTEXT = {
      'x-correlation-id': 'some-hash-here'
    }

    const config = {
      headers: {
        test: 'hello world'
      }
    }

    const patchedConfig = AxiosInterceptor(config)

    patchedConfig.should.deep.equal({
      headers: {
        test: 'hello world',
        'x-correlation-id': 'some-hash-here'
      }
    })
  })

  it('should favour the user set headers over that of the global context', () => {
    global.CONTEXT = {
      'x-correlation-test': 'context'
    }

    const config = {
      headers: {
        'x-correlation-test': 'request'
      }
    }

    const patchedConfig = AxiosInterceptor(config)

    patchedConfig.headers['x-correlation-test'].should.equal('request')
  })
})
