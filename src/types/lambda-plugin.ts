import { Hooks } from '../enums/hooks'
import { LambdaType } from '../enums/lambda-type'
import { MiddlewareFunction } from './middleware'

export interface LambdaPlugin {
  supportedTypes: LambdaType[]

  /**
   * Add a middleware function to be executed for `hook`.
   */
  addHook (hook: Hooks, fn: MiddlewareFunction): void
}
