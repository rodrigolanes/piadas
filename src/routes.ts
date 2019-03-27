import { Router } from 'express'

const routes = Router()

routes.use('/api/auth', require('./controllers/AuthController'))
routes.use('/api/piadas', require('./controllers/PiadaController'))

export default routes
