import AbstractHandler from './abstract-handler'
import ApplyBody from '../plugins/apply-body'
import SnsBodyToJson from '../plugins/sns-body-to-json'
import LambdaType from '../enums/lambda-type'

class SnsHandler extends AbstractHandler {
  constructor () {
    super([ new ApplyBody(), new SnsBodyToJson() ], {}, [ LambdaType.SNS, LambdaType.DEFAULT ])
  }
}

const handler = new SnsHandler()
export default handler.getDecorator()
