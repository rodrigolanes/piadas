import jwt = require('jsonwebtoken')

var createToken = function (auth): string {
  return jwt.sign({
    id: auth.id
  }, 'my-secret',
  {
    expiresIn: 60 * 120
  })
}

export function generateToken (req, res, next): void {
  req.token = createToken(req.auth)
  return next()
}

export function sendToken (req, res): Response {
  res.setHeader('x-auth-token', req.token)
  return res.status(200).send(JSON.stringify(req.user))
}
