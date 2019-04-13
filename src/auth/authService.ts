import User from '../models/UserModel'
import config from '../config/config'
import { ErrorInterface } from '../interfaces/Error'
import { CredentialInterface } from '../interfaces/Credential'
import { getGoogleUser } from './googleAuth'
import _ = require('lodash')
import jwt = require('jsonwebtoken')
import bcrypt = require('bcrypt')

const emailRegex = /\S+@\S+\.\S+/
const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/

const sendErrorsFromDB = (res, dbErrors): Response => {
  const errors : string[] = []
  _.forIn(dbErrors.errors, (error:ErrorInterface) => errors.push(error.message))
  return res.status(400).json({ errors })
}

const generateToken = (email: string): CredentialInterface => {
  const token = jwt.sign({ email }, config.authSecret, { expiresIn: '1 day' })
  return { email, token }
}

const checkEmailIsAllowed = (email: string) : boolean => {
  return !config.emailsAllowed.includes(email)
}

export const login = (req, res): Response | void => {
  const email = req.body.email || ''
  const password = req.body.password || ''

  if (checkEmailIsAllowed(email)) res.status(400).send({ errors: 'Email não autorizado!' })

  User.findOne({ email }, (err, user) => {
    if (err) {
      return sendErrorsFromDB(res, err)
    } else if (user && bcrypt.compareSync(password, user.password)) {
      return res.json(generateToken(user.email))
    } else {
      return res.status(400).send({ errors: ['Usuário/Senha inválidos'] })
    }
  })
}

export const googleLogin = (req, res): Response | void => {
  try {
    const token = req.body.token

    if (!token) {
      return res.status(403).send({ errors: ['No token provided.'] })
    }

    getGoogleUser(token)
      .then(response => {
        const { email } = response
        if (checkEmailIsAllowed(email)) res.status(400).send({ errors: 'Email não autorizado!' })
        return generateToken(email)
      })
      .then(credentials =>
        res.json(credentials)
      )
      .catch(e => {
        throw new Error(e)
      })
  } catch (error) {
    res.sendStatus(500).end(JSON.stringify({ errors: 'Internal server error' }))
    return console.error(error)
  }
}

export const validateToken = (req, res): Response | void => {
  const token = req.body.token || ''
  // jwt.verify(token, config.authSecret, function (err, decoded) {
  jwt.verify(token, config.authSecret, function (err) {
    return res.status(200).send({ valid: !err })
  })
}

export const signup = (req, res): Response | void => {
  const email = req.body.email || ''
  const password = req.body.password || ''
  const confirmPassword = req.body.confirm_password || ''
  if (!email.match(emailRegex)) {
    return res.status(400).send({ errors: ['O e-mail informa está inválido'] })
  }
  if (!password.match(passwordRegex)) {
    return res.status(400).send({
      errors: [
        'Senha precisar ter: uma letra maiúscula, uma letra minúscula, um número, uma caractere especial(@#$%) e tamanho entre 6-20.'
      ]
    })
  }
  const salt = bcrypt.genSaltSync()
  const passwordHash = bcrypt.hashSync(password, salt)

  if (!bcrypt.compareSync(confirmPassword, passwordHash)) {
    return res.status(400).send({ errors: ['Senhas não conferem.'] })
  }
  User.findOne({ email }, (err, user) => {
    if (err) {
      return sendErrorsFromDB(res, err)
    } else if (user) {
      return res.status(400).send({ errors: ['Usuário já cadastrado.'] })
    } else {
      const newUser = new User({ email, password: passwordHash })
      newUser.save(err => {
        if (err) {
          return sendErrorsFromDB(res, err)
        } else {
          login(req, res)
        }
      })
    }
  })
}
