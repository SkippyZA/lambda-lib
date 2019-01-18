/**
 * Return JSON object or the original string.
 *
 * @param jsonString json string
 * @return {{}|string}
 */
export default function (jsonString) {
  try {
    return JSON.parse(jsonString)
  } catch (err) {
    return jsonString
  }
}
