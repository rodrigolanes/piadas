import { Router } from 'express'

const routes = Router()

routes.route('/').get(function (req, res) {
  res.status(200)
  res.send('<h1>Funcionou!</h1>')
})
routes.use('/api/auth', require('./controllers/AuthController'))
routes.use('/api/piadas', require('./controllers/PiadaController'))

export default routes
