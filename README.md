[![Build Status](https://travis-ci.org/SkippyZA/lambda-lib.svg?branch=master)](https://travis-ci.org/SkippyZA/lambda-lib)

# AWS Lambda Lib

This library contains a set of decorators to apply to AWS Lambda function to help abstract the event source
and eliminate boilerplate code

## Example

```javascript
@ApiGateway({ statusCode: 200, cors: true, errorMap: { ReferenceError: 404, Error: 401 } })
helloHandler (event) {
  return Promise.resolve({ hello: world })
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
| PRE_EXECUTE      | The pre execute hook is run right before the execution of handler code. |
| POST_EXECUTE     | This hook, post execute, is run after the execution of the handler code. |
| ON_ERROR         | When ever there is an error which results in a rejected promise, this hook is executed. |

