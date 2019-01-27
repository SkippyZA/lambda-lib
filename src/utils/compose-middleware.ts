import { MiddlewareFunction } from '../types/middleware'
import { Context } from 'aws-lambda'

export default function composeMiddleware (middleware: MiddlewareFunction[]) {
  return function (event: any, res: any, data: any, context: Context, next?: any): Promise<any> {
    // last called middleware #
    let index = -1

    function dispatch (i: number): Promise<any> {
      if (i <= index) {
        return Promise.reject(new Error('next() called multiple times'))
      }

      index = i

      let fn = middleware[i]
      if (i === middleware.length) {
        fn = next
      }

      if (!fn) {
        return Promise.resolve()
      }

      return new Promise((resolve, reject) => {
        try {
          fn(event, res, data, context, (err: Error) => {
            if (err) {
              return reject(err)
            }

            return resolve(dispatch(i + 1))
          })

        } catch (err) {
          return reject(err)
        }
      })
    }

    return dispatch(0)
  }
}
