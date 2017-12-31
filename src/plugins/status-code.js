import AbstractLambdaPlugin from './abstract-lambda-plugin'
import PluginHook from '../enums/hooks'
import LambdaType from '../enums/lambda-type'

export default class StatusCode extends AbstractLambdaPlugin {
  constructor () {
    super('statusCode', LambdaType.API_GATEWAY)

    this.addHook(PluginHook.PRE_EXECUTE, this.statusCodePlugin.bind(this))
  }

  /**
   * Apply the status code supplied if the fn response is successful.
   */
  statusCodePlugin (statusCode) {
    return (req, res, error, context, done) => {
      res.statusCode = statusCode || res.statusCode
      done()
    }
  }
}
