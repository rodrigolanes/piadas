import { Strategy as TwitterStrategy } from 'passport-twitter'
import { User } from '../models/UserModel'

import config from '../auth/config'

import express = require('express')
import passport = require('passport')
import jwt = require('jsonwebtoken')
import expressJwt = require('express-jwt');
import TwitterTokenStrategy = require('passport-twitter-token')

require('dotenv-safe').load()

// const { OAuth2Strategy: GoogleStrategy } = require("passport-google-oauth");
// const { Strategy: FacebookStrategy } = require("passport-facebook");
// const { Strategy: GithubStrategy } = require("passport-github");

const router = express.Router()

let secret: string
if (process.env.SECRET) {
  secret = process.env.SECRET
} else {
  throw new Error('Erro ao carregar váriavel de ambiente!')
}

passport.serializeUser((user, cb) => cb(null, user))
passport.deserializeUser((obj, cb) => cb(null, obj))

// const callback = (accessToken, refreshToken, profile, cb): void => cb(null, profile)

passport.use(new TwitterStrategy(config.TWITTER_CONFIG, function (token, tokenSecret, profile, done) {
  User.upsertTwitterUser(token, tokenSecret, profile, function (err, user) {
    return done(err, user)
  })
}))

passport.use(new TwitterTokenStrategy(config.TWITTER_CONFIG, function (token, tokenSecret, profile, done) {
  User.upsertTwitterUser(token, tokenSecret, profile, function (err, user) {
    return done(err, user)
  })
}))

var createToken = function (auth): string {
  console.log('auth', auth)

  return jwt.sign({
    id: auth.id
  }, secret,
  {
    expiresIn: 1440 // 24 horas
  })
}

var generateToken = function (req, res, next): Response {
  req.token = createToken(req.auth)

  console.log('token', req.token)

  return next()
}

var sendToken = function (req, res): Response {
  res.setHeader('x-auth-token', req.token)
  return res.status(200).send(JSON.stringify(req.user))
}

var authenticate = expressJwt({
  secret: secret,
  requestProperty: 'auth',
  getToken: function (req): string | string[] | undefined | null {
    if (req.headers['x-auth-token']) {
      return req.headers['x-auth-token']
    }
    return null
  }
})

const salvaIdUsuarioNoRequest = (req, res, next): void => {
  if (!req.user) {
    return res.send(401, 'User Not Authenticated')
  }

  // prepare token for API
  req.auth = {
    id: req.user.id
  }

  next()
}

router.get('/twitter', passport.authenticate('twitter'))

router.get('/twitter/token', passport.authenticate('twitter-token'), (req, res) => {
  res.send(req['user'] ? 200 : 401)
})

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
