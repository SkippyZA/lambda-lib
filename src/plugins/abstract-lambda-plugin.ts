import { LambdaType } from '../enums/lambda-type'
import { Hooks } from '../enums/hooks'
import { MiddlewareFunction } from '../types/middleware'

type MiddlewareHooks = { [key in Hooks]?: { [key: string]: MiddlewareFunction } }

/**
 * Abstract class for lambda handler plugins.
 */
export class AbstractLambdaPlugin {
  private supportedLambdaTypes: LambdaType[]
  private hooks: MiddlewareHooks = {}

  /**
   * AbstractLambdaPlugin constructor.
   *
   * @param name plugin name
   * @param supportedLambdaTypes lambda types
   */
  constructor (protected name: string, supportedLambdaTypes?: LambdaType | LambdaType[]) {
    // Ensure we set the supported lambda types to an array, or apply the default lambda type
    if (supportedLambdaTypes) {
      if (Array.isArray(supportedLambdaTypes)) {
        this.supportedLambdaTypes = supportedLambdaTypes
      } else {
        this.supportedLambdaTypes = [ supportedLambdaTypes ]
      }
    } else {
      this.supportedLambdaTypes = [ LambdaType.DEFAULT ]
    }
  }

  /**
   * Add hook for plugin.
   *
   * @param hook plugin hook
   * @param plugin function
   */
  addHook (hook: Hooks, fn: MiddlewareFunction): void {
    if (!this.hooks[hook]) {
      this.hooks[hook] = {}
    }

    this.hooks[hook]![this.name] = fn
  }

  /**
   * Check if this plugin supports the supplied type.
   *
   * @param type lambda type
   * @returns returns true if lambda type supported
   */
  isSupportedType (type: LambdaType): boolean {
    return this.supportedLambdaTypes.indexOf(type) > -1
  }

  /**
   * Get a list for the support types for this lambda plugin
   *
   * @returns list of LambdaType
   */
  getSupportedTypes (): LambdaType[] {
    return this.supportedLambdaTypes
  }
}

export default AbstractLambdaPlugin
