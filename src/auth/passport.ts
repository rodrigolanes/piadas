import { User } from '../models/UserModel'
import config from '../config/config'
import passport = require('passport')
import TwitterTokenStrategy = require('passport-twitter-token')

// import FacebookTokenStrategy = require('passport-facebook-token')
// import GoogleTokenStrategy = require('passport-google-token').Strategy

module.exports = function () {
  passport.use(new TwitterTokenStrategy({
    consumerKey: config.twitterAuth.consumerKey,
    consumerSecret: config.twitterAuth.consumerSecret,
    includeEmail: true
  },
  function (token, tokenSecret, profile, done) {
    User.upsertTwitterUser(token, tokenSecret, profile, function (err, user) {
      return done(err, user)
    })
  }))

  // passport.use(new FacebookTokenStrategy({
  //   clientID: config.facebookAuth.clientID,
  //   clientSecret: config.facebookAuth.clientSecret
  // },
  // function (accessToken, refreshToken, profile, done) {
  //   User.upsertFbUser(accessToken, refreshToken, profile, function (err, user) {
  //     return done(err, user)
  //   })
  // }))

  // passport.use(new GoogleTokenStrategy({
  //   clientID: config.googleAuth.clientID,
  //   clientSecret: config.googleAuth.clientSecret
  // },
  // function (accessToken, refreshToken, profile, done) {
  //   User.upsertGoogleUser(accessToken, refreshToken, profile, function (err, user) {
  //     return done(err, user)
  //   })
  // }))
}
