require('dotenv-safe').load()

const CONFIG = {
  mongodb: process.env.MONGO_URL,
  serverPort: process.env.PORT || 4000,
  pageLimit: process.env.PAGE_LIMIT || 20,
  authSecret: process.env.AUTH_SECRET || '',
  googleAuth: {
    clientId: process.env.GOOGLE_CLIENT_ID || ''
  },
  emailsAllowed: (process.env.EMAILS_ALLOWED || '').split(',')
}

export default CONFIG
