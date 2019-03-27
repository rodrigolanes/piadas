import mongoose = require('mongoose')

require('dotenv-safe').load()

const uri = process.env.MONGO_URL

function connectDB (): void {
  if (uri) {
    mongoose.connect(uri, { useNewUrlParser: true })
  } else {
    throw new Error('String de conexão com o MongoDB não definida.')
  }
}

export default connectDB
