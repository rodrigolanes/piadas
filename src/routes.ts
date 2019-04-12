import { Router } from 'express'

const router = Router()

router.use('/piadas', require('./controllers/PiadaController'))
router.use('/users', require('./controllers/UserController'))

export default router
