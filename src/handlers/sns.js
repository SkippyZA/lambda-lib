import AbstractHandler from './abstract-handler'
import ApplyBody from '../plugins/apply-body'
import SnsBodyToJson from '../plugins/sns-body-to-json'

class SnsHandler extends AbstractHandler {
  constructor () {
    super([ new ApplyBody(), new SnsBodyToJson() ], {})
  }
}

const handler = new SnsHandler()
export default handler.getDecorator()
