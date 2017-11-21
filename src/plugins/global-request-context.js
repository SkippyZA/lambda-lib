import AbstractLambdaPlugin from './abstract-lambda-plugin'
import PluginHook from '../enums/hooks'
import LambdaType from '../enums/lambda-type'

export default class GlobalRequestContext extends AbstractLambdaPlugin {
  constructor () {
    super('globalRequestContext', LambdaType.DEFAULT)

    this.addHook(PluginHook.PRE_EXECUTE, this.setGlobalContext.bind(this))
  }

  setGlobalContext () {
    return (req, res, data, context) => {
      const ctx = {
        rrid: context.awsRequestId
      }

      if (!ctx['x-correlation-id']) {
        ctx['x-correlation-id'] = ctx.rrid
      }

      // api-gateway headers. currently i am just setting these from
      // the headers property. this will expand to place the appropriate
      // headers into the global context.
      if (req.headers) {
        for (var header in req.headers) {
          if (header.toLowerCase().startsWith('x-correlation-')) {
            ctx[header] = req.headers[header]
          }
        }

        if (req.headers['User-Agent']) {
          ctx['User-Agent'] = req.headers['User-Agent']
        }

        if (req.headers['Debug-Log-Enabled'] === 'true') {
          ctx['Debug-Log-Enabled'] = 'true'
        }
      }

      global.CONTEXT = ctx
    }
  }
}
