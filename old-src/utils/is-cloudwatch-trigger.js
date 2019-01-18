export default function isCloudwatchTrigger (event) {
  return (event && event.source && event.source === 'aws.events' && event['detail-type'] === 'Scheduled Event') || false
}
