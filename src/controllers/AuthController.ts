/* eslint-disable @typescript-eslint/camelcase */
import config from '../config/config'
import { generateToken, sendToken } from '../utils/tokens.utils'
import express = require('express')
import request = require('request')
import passport = require('passport')

require('../auth/passport')()

const router = express.Router()

router.route('/twitter/reverse')
  .post(function (req, res) {
    request.post({
      url: 'https://api.twitter.com/oauth/request_token',
      oauth: {
        oauth_callback: config.twitterAuth.callbackURL,
        consumer_key: config.twitterAuth.consumerKey,
        consumer_secret: config.twitterAuth.consumerSecret
      }
    }, function (err, result, body) {
      if (err) {
        return res.status(500).send({ message: err.message })
      }
      var jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}'
      res.send(JSON.parse(jsonStr))
    })
  })

router.route('/twitter')
  .post((req, res, next) => {
    request.post({
      url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
      oauth: {
        consumer_key: config.twitterAuth.consumerKey,
        consumer_secret: config.twitterAuth.consumerSecret,
        token: req.query.oauth_token
      },
      form: { oauth_verifier: req.query.oauth_verifier }
    }, function (err, r, body) {
      if (err) {
        return res.status(500).send({ message: err.message })
      }

      const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}'
      const parsedBody = JSON.parse(bodyString)

      req.body['oauth_token'] = parsedBody.oauth_token
      req.body['oauth_token_secret'] = parsedBody.oauth_token_secret
      req.body['user_id'] = parsedBody.user_id

      next()
    })
  }, passport.authenticate('twitter-token', { session: false }), function (req, res, next) {
    if (!req['user']) {
      return res.status(401).send('User Not Authenticated')
    }
    req['auth'] = {
      id: req['user'].id
    }

    return next()
  }, generateToken, sendToken)

module.exports = router
