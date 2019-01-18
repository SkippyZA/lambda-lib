import AbstractLambdaPlugin from './abstract-lambda-plugin'
import PluginHook from '../enums/hooks'
import LambdaType from '../enums/lambda-type'

export default class Cors extends AbstractLambdaPlugin {
  constructor () {
    super('cors', LambdaType.API_GATEWAY)

    this.addHook(PluginHook.PRE_EXECUTE, this.corsPlugin.bind(this))
  }

  /**
   * Add cors headers to event
   */
  corsPlugin (useCors) {
    return (req, res, error, context, done) => {
      if (useCors) {
        const corsHeaders = {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Methods': 'POST, GET, PUT, PATCH, DELETE, OPTIONS'
        }

        res.headers = {
          ...corsHeaders,
          ...res.headers
        }
      }

      done()
    }
  }
}
