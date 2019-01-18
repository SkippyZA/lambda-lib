export function safeJson <T> (jsonString: string): T | string {
  try {
    return JSON.parse(jsonString)
  } catch (err) {
    return jsonString
  }
}
