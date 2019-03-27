import * as express from 'express'
import passport from 'passport'
import { Strategy as TwitterStrategy } from 'passport-twitter'

import config from '../auth/config'

require('dotenv-safe').load()

// const { OAuth2Strategy: GoogleStrategy } = require("passport-google-oauth");
// const { Strategy: FacebookStrategy } = require("passport-facebook");
// const { Strategy: GithubStrategy } = require("passport-github");

const router = express.Router()

passport.serializeUser((user, cb) => cb(null, user))
passport.deserializeUser((obj, cb) => cb(null, obj))

const callback = (accessToken, refreshToken, profile, cb): void => cb(null, profile)

passport.use(new TwitterStrategy(config.TWITTER_CONFIG, callback))

router.get('/twitter', passport.authenticate('twitter'))

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
