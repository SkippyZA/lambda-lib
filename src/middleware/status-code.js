/**
 * Apply the status code supplied if the fn response is successful.
 */
export default (statusCode) => (req, res) => {
  res.statusCode = statusCode || res.statusCode
}
