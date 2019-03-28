import connectDB from './db/db'
import routes from './routes'
import cors = require('cors')
import morgan = require('morgan')
import passport = require('passport')
import express = require('express')
import session = require('express-session')
import mongoose = require('mongoose')
import connectMongo = require('connect-mongo')

require('dotenv-safe').load()

const app = express()
const MongoStore = connectMongo(session)

connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 19 * 60000 }, // store for 19 minutes
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }) })
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
