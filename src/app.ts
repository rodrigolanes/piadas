import connectDB from './db/db'
import routes from './routes'
import cors = require('cors')
import morgan = require('morgan')
import passport = require('passport')
import express = require('express')

require('dotenv-safe').load()

const app = express()

connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(
  require('express-session')({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
  })
)

app.use(passport.initialize())
app.use(passport.session())

var corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
}

app.use(cors(corsOption))

app.use(routes)

export default app
