const express = require('express');
const { login, refreshToken, googleCallback, logout, signUp, me } = require('../controllers/authController');
const { verifyAccessToken } = require('../middlewares/authMiddleware');
const passport = require('passport');

const router = express.Router();

router.post('/login', login);
router.post('/signup', signUp)
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
}));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), googleCallback);
router.post('/refresh', refreshToken);
router.post('/logout', verifyAccessToken, logout);
router.get('/me', me);

module.exports = router;