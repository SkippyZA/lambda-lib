import AbstractLambdaPlugin from '../../../src/plugins/abstract-lambda-plugin'
import LambdaType from '../../../src/enums/lambda-type'

describe('abstract lambda plugin', () => {
  describe('when being constructed', () => {
    it('should support a string parameter for `supportedLambdaTypes`', () => {
      const testType = 'TEST_TYPE'
      const abstractPlugin = new AbstractLambdaPlugin('test', testType)

      const supportedTypes = abstractPlugin.getSupportedTypes()

      supportedTypes.should.deep.equal([ testType ])

      abstractPlugin.isSupportedType(testType).should.be.true()
    })

    it('should support an array of types for `supportedLambdaTypes` parameter', () => {
      const testTypeA = 'TEST_TYPE_A'
      const testTypeB = 'TEST_TYPE_B'
      const abstractPlugin = new AbstractLambdaPlugin('test', [ testTypeA, testTypeB ])

      const supportedTypes = abstractPlugin.getSupportedTypes()

      supportedTypes.should.deep.equal([ testTypeA, testTypeB ])

      abstractPlugin.isSupportedType(testTypeA).should.be.true()
      abstractPlugin.isSupportedType(testTypeB).should.be.true()
    })

    it('should default to lambda type `LambdaType.DEFAULT` if nothing is specified', () => {
      const abstractPlugin = new AbstractLambdaPlugin('test')

      abstractPlugin.isSupportedType(LambdaType.DEFAULT).should.be.true()
    })
  })
})
