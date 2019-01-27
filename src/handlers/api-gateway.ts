export function ApiGateway (value: boolean) {
  return function (this: any, target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log()
    console.log('-------- propertyKey ---------------------')
    console.log(propertyKey)
    console.log('-------- descriptor ----------------------')
    console.log(descriptor)
    console.log('-------- target --------------------------')
    console.log(target)
    console.log('-------- this ----------------------------')
    console.log(this)
    console.log('-------- descriptor value ----------------')
    console.log(descriptor.value)
    console.log('-------- value ---------------------------')
    console.log('value:', value)
    console.log('------------------------------------------')
  }
}
