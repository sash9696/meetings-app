import { Router } from "express";
import * as authController from '../controllers/auth.controller.js'
import {authMiddleware} from '../middleware/auth.js'

const router = Router();


// register

router.post('/register', authController.register)

///api/auth/register

// login

router.post('/login', authController.login)

// /me
router.post('/me',authMiddleware, authController.me)


// logout

router.post('/logout', authController.logout)


export default router;