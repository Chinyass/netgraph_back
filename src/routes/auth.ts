import { Router } from "express"

const router = Router()

router.post('/registration',)
router.post('/login', )
router.post('/logout',)

router.get('/activate/:link')
router.get('/refresh')

export default router