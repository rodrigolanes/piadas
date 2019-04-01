import { Router } from 'express'

const router = Router()

router.route('/').get(function (req, res) {
  res.status(200)
  res.send('<h1>Funcionou!</h1>')
})

router.use('/auth', require('./controllers/AuthController'))

router.use('/piadas', require('./controllers/PiadaController'))

export default router
