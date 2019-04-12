import connectDB from './db/db'
import routes from './routes'
import morgan = require('morgan')
import express = require('express')
import allowCors = require('./config/cors')

const app = express()

connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(allowCors)

app.get('/', (req, res) => res.status(200).send('<h1>OK!</h1>'))

app.use('/api/v1/', routes)

export default app
