import AbstractLambdaPlugin from './abstract-lambda-plugin'
import PluginHook from '../enums/hooks'
import LambdaType from '../enums/lambda-type'

export default class StringifyBody extends AbstractLambdaPlugin {
  constructor () {
    super('stringifyBody', LambdaType.API_GATEWAY)

    this.addHook(PluginHook.POST_EXECUTE, this.stringifyBody.bind(this))
  }

  /**
   * Stringify the response body
   */
  stringifyBody (statusCode) {
    return (req, res, error, context, done) => {
      res.body = JSON.stringify(res.body)
      done()
    }
  }
}
