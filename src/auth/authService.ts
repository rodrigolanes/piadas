import User from '../models/UserModel'
import config from '../config/config'
import { ErrorInterface } from '../interfaces/ErrorInterface'
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

export const login = (req, res, next): Response | void => {
  const email = req.body.email || ''
  const password = req.body.password || ''

  User.findOne({ email }, (err, user) => {
    if (err) {
      return sendErrorsFromDB(res, err)
    } else if (user && bcrypt.compareSync(password, user.password)) {
      const { email } = user
      const token = jwt.sign({ email }, config.authSecret, { expiresIn: '1 day' })
      return res.json({ email, token })
    } else {
      return res.status(400).send({ user, errors: ['Usuário/Senha inválidos'] })
    }
  })
}

export const validateToken = (req, res): Response | void => {
  const token = req.body.token || ''
  jwt.verify(token, config.authSecret, function (err, decoded) {
    return res.status(200).send({ valid: !err })
  })
}

export const signup = (req, res, next): Response | void => {
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
          login(req, res, next)
        }
      })
    }
  })
}
