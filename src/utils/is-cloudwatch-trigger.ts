/**
 * Validate if the supplied event object is a 'Scheduled Event'
 */
export function isCloudwatchTrigger (event: any): boolean {
  return (event && event.source && event.source === 'aws.events' && event['detail-type'] === 'Scheduled Event') || false
}
