import ApiGatewayPlugin from '../api-gateway-plugin'

export default class Cors extends ApiGatewayPlugin {
  constructor () {
    super('cors')

    this.addHook(ApiGatewayPlugin.Hook.PRE_EXECUTE, this.corsPlugin.bind(this))
  }

  /**
   * Add cors headers to event
   */
  corsPlugin (useCors) {
    return (req, res, error) => {
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
    }
  }
}
