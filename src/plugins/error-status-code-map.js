import AbstractLambdaPlugin from './abstract-lambda-plugin'
import PluginHook from '../enums/hooks'
import LambdaType from '../enums/lambda-type'

export default class ErrorStatusCodeMap extends AbstractLambdaPlugin {
  constructor () {
    super('errorMap', LambdaType.API_GATEWAY)

    this.addHook(PluginHook.ON_ERROR, this.errorMapper.bind(this))
  }

  /**
   * Map errors to custom status codes
   */
  errorMapper (errorMap) {
    errorMap = errorMap || {}

    return (req, res, error) => {
      const errorFromMap = Object.getOwnPropertyNames(errorMap)
        .find(prop => error.constructor.name === prop)

      res.statusCode = errorMap[errorFromMap] || 500
    }
  }
}
