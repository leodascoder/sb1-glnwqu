import express from 'express';
import { register, login, verifyEmail } from '../controllers/authController.js';
import { validateRegistration, validateLogin } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.get('/verify/:token', verifyEmail);

export default router;