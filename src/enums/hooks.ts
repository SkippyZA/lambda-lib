/**
 * Hooks availabe for plugins
 */
export enum Hooks {
  INITIALIZE = 'INITIALIZE',
  PRE_EXECUTE = 'PRE_EXECUTE',
  POST_EXECUTE = 'POST_EXECUTE',
  ON_ERROR = 'ON_ERROR',
  FINALLY = 'FINALLY'
}
