import { Router } from 'express'
import container from '../config/dependency-injection'
import { changeSeats, organizeConference } from '../controllers/conference.controllers'
import { isAuthenticated } from '../middlewares/authentication.middleware'

const router = Router()

router.use(isAuthenticated)
router.post('/conference', organizeConference(container))
router.patch('/conference/seats/:id', changeSeats(container))

export default router