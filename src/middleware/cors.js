/**
 * Add cors headers to event
 */
export default (useCors) => (req, res) => {
  if (useCors) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Methods': 'POST, GET, PUT, PATCH, DELETE, OPTIONS'
    }

    res.headers = {
      ...corsHeaders,
      ...res.headers
    }
  }
}
