import config from '../config/config'
import mongoose = require('mongoose')

const uri = config.mongodb

function connectDB (): void {
  if (uri) {
    mongoose.connect(uri, { useCreateIndex: true,
      useNewUrlParser: true })
    console.log('MongoDB connectado!')
  } else {
    throw new Error('String de conexão com o MongoDB não definida.')
  }
}

export default connectDB
