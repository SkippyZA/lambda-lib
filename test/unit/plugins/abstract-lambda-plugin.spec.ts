import AbstractLambdaPlugin from '../../../src/plugins/abstract-lambda-plugin'
import { LambdaType } from '../../../src/enums/lambda-type'

const PLUGIN_NAME = 'test'

describe('Plugin: Abstract lambda plugin', () => {
  describe('when being constructed', () => {
    it('should default to lambda type `LambdaType.DEFAULT` if nothing is specified', () => {
      const abstractPlugin = new AbstractLambdaPlugin(PLUGIN_NAME)

      abstractPlugin.isSupportedType(LambdaType.DEFAULT)
        .should.be.true
    })

    it('should support a single parameter for `supportedLambdaTypes`', () => {
      const abstractPlugin = new AbstractLambdaPlugin(PLUGIN_NAME, LambdaType.DEFAULT)

      abstractPlugin.getSupportedTypes()
        .should.deep.equal([ LambdaType.DEFAULT ])

      abstractPlugin.isSupportedType(LambdaType.DEFAULT)
        .should.be.true
    })

    it('should support an array of types for `supportedLambdaTypes` parameter', () => {
      const testTypeA = LambdaType.SNS
      const testTypeB = LambdaType.API_GATEWAY
      const abstractPlugin = new AbstractLambdaPlugin('test', [ testTypeA, testTypeB ])

      abstractPlugin.getSupportedTypes()
        .should.deep.equal([ testTypeA, testTypeB ])

      abstractPlugin.isSupportedType(testTypeA)
        .should.be.true

      abstractPlugin.isSupportedType(testTypeB)
        .should.be.true
    })
  })
})
