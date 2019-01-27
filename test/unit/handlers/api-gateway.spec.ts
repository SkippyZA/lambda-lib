import { ApiGateway } from '../../../src/handlers/api-gateway'

class SampleHandler {
  public test: string = 'bitch'

  constructor(public name: string) {}

  @ApiGateway(true)
  testHandler(): string {
    return 'hello ' + this.name
  }
}

describe('ApiGateway decorator', () => {
  it('test', () => {
    const skippy = new SampleHandler('skippy')

    skippy.testHandler().should.equal('hello skippy')
  })
})
