import { Strategy as TwitterStrategy } from 'passport-twitter'
import { User } from '../models/UserModel'

import config from '../auth/config'
import express = require('express')
import passport = require('passport')
import jwt = require('jsonwebtoken')
import expressJwt = require('express-jwt');

require('dotenv-safe').load()

// const { OAuth2Strategy: GoogleStrategy } = require("passport-google-oauth");
// const { Strategy: FacebookStrategy } = require("passport-facebook");
// const { Strategy: GithubStrategy } = require("passport-github");

const router = express.Router()

passport.serializeUser((user, cb) => cb(null, user))
passport.deserializeUser((obj, cb) => cb(null, obj))

// const callback = (accessToken, refreshToken, profile, cb): void => cb(null, profile)

passport.use(new TwitterStrategy(config.TWITTER_CONFIG, function (token, tokenSecret, profile, done) {
  User.schema.statics.upsertTwitterUser(token, tokenSecret, profile, function (err, user) {
    return done(err, user)
  })
}))

var createToken = function (auth): string {
  const secret = process.env.SECRET
  if (!secret) throw new Error('Secret não definido.')

  return jwt.sign({
    id: auth.id
  }, secret,
  {
    expiresIn: 60 * 120
  })
}

var generateToken = function (req, res, next): Response {
  req.token = createToken(req.auth)
  return next()
}

var sendToken = function (req, res): Response {
  res.setHeader('x-auth-token', req.token)
  return res.status(200).send(JSON.stringify(req.user))
}

var authenticate = expressJwt({
  secret: 'my-secret',
  requestProperty: 'auth',
  getToken: function (req): string | string[] | undefined | null {
    if (req.headers['x-auth-token']) {
      return req.headers['x-auth-token']
    }
    return null
  }
})

router.get('/twitter', passport.authenticate('twitter'), generateToken, sendToken)

router.get(
  '/twitter/callback',
  passport.authenticate('twitter', {
    successRedirect: '/api/piadas',
    failureRedirect: '/login'
  })
)

module.exports = router
// passport.use(new GoogleStrategy(GOOGLE_CONFIG, callback))
// passport.use(new FacebookStrategy(FACEBOOK_CONFIG, callback))
// passport.use(new GithubStrategy(GITHUB_CONFIG, callback))

// module.exports = () => {

// Allowing passport to serialize and deserialize users into sessions
// passport.serializeUser((user, cb) => cb(null, user))
// passport.deserializeUser((obj, cb) => cb(null, obj))

// The function that is called when an OAuth provider sends back user
// information.  Normally, you would save the user to the database here
// in a callback that was customized for each provider.
// const callback = (accessToken, refreshToken, profile, cb) => cb(null, profile)

// Adding each OAuth provider's strategy to passport
// passport.use(new TwitterStrategy(TWITTER_CONFIG, callback))
// passport.use(new GoogleStrategy(GOOGLE_CONFIG, callback))
// passport.use(new FacebookStrategy(FACEBOOK_CONFIG, callback))
// passport.use(new GithubStrategy(GITHUB_CONFIG, callback))
// }
