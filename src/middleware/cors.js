/**
 * Add cors headers to event
 */
export default () => (req, res) => {
  if (cors) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Methods': 'POST, GET, PUT, PATCH, DELETE, OPTIONS'
    }

    res.headers = {
      ...corsHeaders,
      ...res.headers
    }

    DEBUG && console.log('We have cors!', JSON.stringify(res.headers, '', 2))
  }
}


