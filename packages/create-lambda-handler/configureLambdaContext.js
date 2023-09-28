export const configureLambdaContext = ({ _event, _context }) => {
  // Make sure to add this so you can re-use `conn` between function calls.
  // See https://www.mongodb.com/blog/post/serverless-development-with-nodejs-aws-lambda-mongodb-atlas
  _context.callbackWaitsForEmptyEventLoop = false
  return { _event, _context }
}
