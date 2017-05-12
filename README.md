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

