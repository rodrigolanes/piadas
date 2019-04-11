require('dotenv-safe').load()

const CONFIG = {
  mongodb: process.env.MONGO_URL,
  serverPort: process.env.PORT || 4000,
  pageLimit: process.env.PAGE_LIMIT || 20,
  secret: process.env.SECRET,
  twitterAuth: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK_URL,
    includeEmail: true
  }
}

export default CONFIG
