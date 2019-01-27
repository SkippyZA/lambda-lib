import { Context } from 'aws-lambda'

export type MiddlewareFunction = (req: any, res: any, event: any, context: Context, done: any) => void
