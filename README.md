[![Build Status](https://travis-ci.org/SkippyZA/lambda-lib.svg?branch=master)](https://travis-ci.org/SkippyZA/lambda-lib)


# AWS Lambda Lib

This library contains a set of decorators to apply to AWS Lambda function to help abstract the event source
and eliminate boilerplate code


## Example

```javascript
@ApiGateway({ statusCode: 200, cors: true })
helloHandler (event) {
  return Promise.resolve({ hello: world })
}
```

Target Syntax (An idea of what I am going for)...
```javascript
// Global config
ApiGateway.registerMiddleware('statusCode', statusCodeMiddleware)
ApiGateway.registerMiddleware('cors', corsMiddleware)
ApiGateway.registerMiddleware('stringify-body', stringifyBodyMiddleware)

ApiGateway.addAfterMiddleware('cors')
ApiGateway.addBeforeMiddleware('statusCode', statusCodeMiddelware)

// In local handler
@ApiGateway({ statusCode: 200, cors: true })
helloHandler (event) {
  return Promise.resolve({ hello: world })
}
```
