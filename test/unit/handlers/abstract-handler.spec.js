import { expect } from 'chai'
import sinon from 'sinon'
import AbstractLambdaPlugin from '../../../src/plugins/abstract-lambda-plugin'
import AbstractHandler from '../../../src/handlers/abstract-handler'

describe('abstract handler', () => {
  describe('#registerPlugin', () => {
    class SampleHandler extends AbstractHandler {
    }

    it('should register a plugin', () => {
      const pluginMock = sinon.createStubInstance(AbstractLambdaPlugin)
      pluginMock.isSupportedType.returns(true)

      const handler = new SampleHandler()
      handler.registerPlugin(pluginMock)

      handler.registeredPlugins.length.should.equal(1)
    })

    it('should throw an error if not a valid plugin type', () => {
      const pluginMock = sinon.createStubInstance(AbstractLambdaPlugin)
      pluginMock.isSupportedType.returns(false)

      const handler = new SampleHandler()

      expect(() => handler.registerPlugin(pluginMock)).to.throw(TypeError)
    })
  })
})
