import AbstractLambdaPlugin from './abstract-lambda-plugin'
import { LambdaType } from '../enums/lambda-type'
import { Hooks } from '../enums/hooks'
import { Context } from 'aws-lambda'
import { MiddlewareFunction } from '../types/middleware'

export class Cors extends AbstractLambdaPlugin {
  constructor () {
    super('cors', LambdaType.API_GATEWAY)

    this.addHook(Hooks.PRE_EXECUTE, this.corsPlugin.bind(this))
  }

  corsPlugin (useCors: boolean): MiddlewareFunction {
    return (_: any, res: any, __: any, ___: Context, done: any) => {
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
