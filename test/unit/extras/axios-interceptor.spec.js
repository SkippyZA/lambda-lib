import AxiosInterceptor from '../../../src/extras/axios-interceptor'

describe('axios interceptor', () => {
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
})
