import AbstractLambdaPlugin from './abstract-lambda-plugin'
import PluginHook from '../enums/hooks'
import LambdaType from '../enums/lambda-type'
import safeJson from '../utils/safe-json'

export default class SnsBodyToJson extends AbstractLambdaPlugin {
  constructor () {
    super('snsBodyToJson', LambdaType.SNS)

    this.addHook(PluginHook.PRE_EXECUTE, this.processRequestBody.bind(this))
  }

  processRequestBody () {
    return (req, res, event, context, done) => {
      const record = event.Records && event.Records.length && event.Records[0]

      if (record.Sns && record.Sns.Message) {
        event.body = safeJson(record.Sns.Message)
        event.subject = record.Sns.Subject
        event.arn = record.Sns.TopicArn
        event.messageId = record.Sns.MessageId
        event.timestamp = record.Sns.Timestamp
      }

      done()
    }
  }
}
