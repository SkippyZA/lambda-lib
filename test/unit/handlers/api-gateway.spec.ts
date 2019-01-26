import { ApiGateway } from '../../../src/handlers/api-gateway'

class SampleHandler {
  constructor(public name: string) {}

  @ApiGateway(true)
  testHandler(): void {
    console.log('---------- hello ' + this.name)
  }
}

describe('ApiGateway decorator', () => {
  it('test', () => {
    const skippy = new SampleHandler('skippy')
    const bla = new SampleHandler('bla')

    skippy.testHandler()
    bla.testHandler()
  })

})
