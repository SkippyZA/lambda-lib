import AbstractLambdaPlugin from './abstract-lambda-plugin'
import PluginHook from '../enums/hooks'
import LambdaType from '../enums/lambda-type'

export default class ApplyBody extends AbstractLambdaPlugin {
  constructor () {
    super('applyBody', LambdaType.DEFAULT)

    this.addHook(PluginHook.POST_EXECUTE, this.applyBody.bind(this))
  }

  applyBody () {
    return (req, res, data, context, done) => {
      res.data = data
      done()
    }
  }
}
