/**
 * Map the body to json if it able to be.
 */
export default () => (req, res) => {
  res.body = JSON.stringify(res.body)
}
