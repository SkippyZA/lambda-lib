import AbstractHandler from './abstract-handler'
import ApplyBody from '../plugins/apply-body'

class LambdaHandler extends AbstractHandler {
  constructor () {
    super([ new ApplyBody() ], {})
  }
}

const handler = new LambdaHandler()
export default handler.getDecorator()
