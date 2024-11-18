import { Router } from "express"
import { registration, login, logout, activate, refresh } from '../handlers/auth'
const router = Router()

router.post('/registration', registration)
router.post('/login', login)
router.post('/logout', logout)

router.get('/activate/:link', activate)
router.get('/refresh', refresh)

export default router