import AbstractLambdaPlugin from './abstract-lambda-plugin'
import PluginHook from '../enums/hooks'
import LambdaType from '../enums/lambda-type'
import safeJson from '../utils/safe-json'

export default class ParseBodyToJson extends AbstractLambdaPlugin {
  constructor () {
    super('parseBodyToJson', LambdaType.API_GATEWAY)

    this.addHook(PluginHook.PRE_EXECUTE, this.processRequestBody.bind(this))
  }

  processRequestBody () {
    return (req, res, event, context, done) => {
      event.body = safeJson(event.body)
      done()
    }
  }
}
