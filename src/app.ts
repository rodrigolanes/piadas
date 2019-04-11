import connectDB from './db/db'
import routes from './routes'
import config from './config/config'
import cors = require('cors')
import morgan = require('morgan')
import passport = require('passport')
import express = require('express')

const app = express()

if (config.secret) {
  app.set('SECRET', config.secret)
} else {
  throw new Error('Erro ao carregar váriavel de ambiente!')
}

connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
// app.use(session({
//   secret: app.get('SECRET'),
//   resave: true,
//   saveUninitialized: true,
//   cookie: { maxAge: 19 * 60000 }, // store for 19 minutes
//   store: new MongoStore({
//     mongooseConnection: mongoose.connection
//   }) })
// )

app.use(passport.initialize())
// app.use(passport.session())

var corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
}

app.use(cors(corsOption))

app.get('/', (req, res) => res.status(200).send('<h1>OK!</h1>'))

app.use('/api/v1/', routes)

export default app
