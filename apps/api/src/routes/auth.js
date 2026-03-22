import { Router } from "express";
import * as authController from '../controllers/auth.controller.js'

const router = Router();


// register

router.post('/register', authController.register)

///api/auth/register

// login

router.post('/login', authController.login)

// /me
router.post('/me', authController.me)


// logout

router.post('/logout', authController.logout)


export default router;