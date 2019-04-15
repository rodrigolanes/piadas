import Piada from '../models/PiadaModel'
import config from '../config/config'
import auth from '../auth/auth'

import express = require('express')

const router = express.Router()

router.get('/', function (req, res, next) {
  const page = +req.query.page || 1
  const limit: number = +req.query.limit || +config.pageLimit

  const { pergunta, resposta } = req.query

  let query = {}

  if (pergunta || resposta) {
    query = { $and: [ { 'pergunta': new RegExp(pergunta, 'i') }, { 'resposta': new RegExp(resposta, 'i') } ] }
  }

  Piada.find(query)
    .skip(limit * (page - 1))
    .limit(limit)
    .exec(function (err, result) {
      if (err) next(err)
      Piada.countDocuments(query).exec((err, count) => {
        if (err) next(err)

        res.json({
          items: result,
          currentPage: page,
          pageSize: result.length,
          pages: Math.ceil(count / limit),
          total: count
        })
      })
    })
})

router.get('/:id', function (req, res, next) {
  const id = req.params.id

  Piada.findById(id, function (err, result) {
    if (err) next(err)

    res.json(result)
  })
})

router.post('/', auth, function (req, res, next) {
  const novaPiada = new Piada(req.body)

  novaPiada.save(function (err, result) {
    if (err) next(err)

    res.json(result)
  })
})

router.put('/:id', auth, function (req, res, next) {
  const _id = req.params.id

  const { pergunta, resposta } = new Piada(req.body)

  Piada.findOneAndUpdate({ _id }, { pergunta, resposta }, { new: true }, function (err, result) {
    if (err) next(err)

    res.json(result)
  })
})

router.delete('/:id', auth, function (req, res, next) {
  const _id = req.params.id

  Piada.findOneAndRemove({ _id }, (err, result) => {
    if (err) next(err)

    return res.json(result)
  })
})

module.exports = router
