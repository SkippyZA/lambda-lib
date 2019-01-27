import { ApiGateway } from '../../../src/handlers/api-gateway'

class SampleHandler {
  constructor(public name: string) {}

  @ApiGateway(true)
  testHandler(): string {
    return 'hello ' + this.name
  }
}

describe('ApiGateway decorator', () => {
  it('test', () => {
    const skippy = new SampleHandler('skippy')
    const bla = new SampleHandler('bla')

    skippy.testHandler().should.equal('hello skippy')
    bla.testHandler().should.equal('hello bla')
  })
})
