import routes from './routes'
import config from './config/config'
import morgan = require('morgan')
import express = require('express')
import allowCors = require('./config/cors')
import mongoose = require('mongoose')

const app = express()

const uri = config.mongodb

if (uri) {
  mongoose.connect(uri, { useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true })
  console.log('MongoDB connectado!')
} else {
  throw new Error('String de conexão com o MongoDB não definida.')
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(allowCors)

app.get('/', (req, res) => res.status(200).send('<h1>OK!</h1>'))

app.use(express.static('./src/assets'))

app.use('/api/v1/', routes)

export default app
