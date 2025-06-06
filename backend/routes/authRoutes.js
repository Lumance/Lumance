import { Router } from 'express';
import { login, handleGoogleAuth, logout, register, me, sendOtp } from '../controllers/authController.js';
import { verifyAccessToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/login', login);
router.post('/signup', register);

router.post('/send-otp', sendOtp)

router.post('/google', handleGoogleAuth);

router.get('/me', verifyAccessToken, me);
router.post('/logout', logout);

export default router;