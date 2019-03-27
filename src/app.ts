import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import passport from 'passport'
import connectDB from './db/db'

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

app.use('/api/auth', require('./controllers/AuthController'))

app.use('/api/piadas', require('./controllers/PiadaController'))

export default app
