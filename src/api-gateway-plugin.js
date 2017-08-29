class ApiGatewayPlugin {
  constructor (name) {
    this.name = name
    this.hooks = {}
  }

  addHook (hook, fn) {
    if (!this.hooks[hook]) {
      this.hooks[hook] = {}
    }

    this.hooks[hook][this.name] = fn
  }
}

ApiGatewayPlugin.Hook = {
  PRE_EXECUTE: 'PRE_EXECUTE',
  POST_EXECUTE: 'POST_EXECUTE',
  FINALLY: 'FINALLY',
  ON_ERROR: 'ON_ERROR'
}

export default ApiGatewayPlugin
