[![Build Status](https://travis-ci.org/SkippyZA/lambda-lib.svg?branch=master)](https://travis-ci.org/SkippyZA/lambda-lib)
[![License](https://img.shields.io/github/license/SkippyZA/lambda-lib.svg)](./LICENSE)
[![NPM](https://img.shields.io/npm/v/lambda-lib.svg)](http://npmjs.com/package/lambda-lib)
[![codecov](https://codecov.io/gh/SkippyZA/lambda-lib/branch/master/graph/badge.svg)](https://codecov.io/gh/SkippyZA/lambda-lib)

# AWS Lambda Lib

This library contains a set of decorators to apply to AWS Lambda function to help abstract the event source
and eliminate boilerplate code

## Example

```javascript
import { HandlerController, ApiGateway } from 'lambda-lib'

const errorMap = [
  {
    error: ReferenceError,
    status: 400
  },
  {
    error: Error,
    status: 404
  }
]

@HandlerController
class SampleLambdaHandler {
  @ApiGateway({ statusCode: 200, cors: true })
  helloHandler (event) {
    return Promise.resolve({ hello: world })
  }

  @ApiGateway({ statusCode: 200, errorMap: errorMap })
  failedHandler (event) {
    return Promise.reject(new ReferenceError('I am a reference error'))
  }
}

const handler = new SampleLambdaHandler()

export default handler.getHandlers()
```

### Sample Response

#### HelloHandler Response

```bash
HTTP/1.1 200 OK
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: POST, GET, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Type: application/json
Date: Tue, 29 Aug 2017 17:07:04 GMT
accept-ranges: bytes
cache-control: no-cache
content-length: 39
vary: origin,accept-encoding

{
  "hello": "world"
}
```


#### FailedHandler Response

```bash
HTTP/1.1 400 Bad Request
Connection: keep-alive
Content-Type: application/json
Date: Tue, 29 Aug 2017 17:08:00 GMT
cache-control: no-cache
content-length: 398
vary: accept-encoding

{
  "error": {
    "message": "I am a reference error",
    "name": "ReferenceError",
    "_stackTrace": [
      "ReferenceError: I am a reference error",
      "at SampleLambdaHandler.failedHandler (/.../src/resources/example/index.js:223:15)",
      "at /.../node_modules/lambda-lib/lib/api-gateway.js:93:19",
      "at process._tickDomainCallback (internal/process/next_tick.js:135:7)"
    ]
  }
}
```

## Specifying a custom error response

```javascript
import { Plugins } from 'lambda-lib'

// Registering a custom error response plugin. This is applied globally.
ApiGateway.registerPlugin(new Plugins.ErrorResponse(err => {
  return {
    test: 'This is the error response body for all errors',
    error: err.message
  }
}))
```

#### Sample response with custom error

```bash
HTTP/1.1 400 Bad Request
Connection: keep-alive
Content-Type: application/json
Date: Tue, 29 Aug 2017 17:08:00 GMT
cache-control: no-cache
content-length: 398
vary: accept-encoding

{
  "test": "This is the error response body for all errors",
  "error": "I am a reference error"
}
```

## Included Plugins

| Plugin           | Description                                                    |
| ---------------- | -------------------------------------------------------------- |
| cors             | When true, a set of default CORS headers are added to the response. Such as: `Access-Control-Allow-Origin`, `Access-Control-Allow-Credentials`, `Access-Control-Allow-Methods` |
| statusCode       | Default status code for the response. Any object resolved via a Promise in the handler, will get this status code. |
| errorMap         | Mapping of error types to response codes for rejected promises. |
| errorResponse    | Format the response of an error. |

## Plugin Hooks

| Hook             | Description                                                    |
| ---------------- | -------------------------------------------------------------- |
| INITIALIZE       | Initialize is executed right at the beginning of the request, before any default plugins have been executed |
| PRE_EXECUTE      | The pre execute hook is run right before the execution of handler code. |
| POST_EXECUTE     | This hook, post execute, is run after the execution of the handler code. |
| ON_ERROR         | When ever there is an error which results in a rejected promise, this hook is executed. |
| FINALLY          | Final hook executed after the response has been sent to the client already. (Unable to manipulate response contents here) |

## Writing your own plugin

See [built-in plugins](./src/plugins) for samples
