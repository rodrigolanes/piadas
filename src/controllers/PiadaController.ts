import Piada from '../models/PiadaModel'

import express = require('express')

require('dotenv-safe').load()

const router = express.Router()

router.get('/', function (req, res, next) {
  const page = +req.query.page || 1
  const limit: number = +req.query.limit || +(process.env.PAGE_LIMIT || 20)

  const query = {}

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

router.post('/', function (req, res, next) {
  const novaPiada = new Piada(req.body)

  novaPiada.save(function (err, result) {
    if (err) next(err)

    res.json(result)
  })
})

router.put('/:id', function (req, res, next) {
  const _id = req.params.id

  const { pergunta, resposta } = new Piada(req.body)

  Piada.findOneAndUpdate({ _id }, { pergunta, resposta }, { new: true }, function (err, result) {
    if (err) next(err)

    res.json(result)
  })
})

router.delete('/:id', function (req, res, next) {
  const _id = req.params.id

  Piada.findOneAndRemove({ _id }, (err, result) => {
    if (err) next(err)

    return res.json(result)
  })
})

module.exports = router
