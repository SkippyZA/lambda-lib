/**
 * Stringify the response body
 */
export default () => (req, res) => {
  res.body = JSON.stringify(res.body)
}
