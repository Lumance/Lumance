import validator from 'validator';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import Otp from '../models/RegistrationOtp.js'
import { generateToken } from '../middlewares/authMiddleware.js';
import { sendOtpToEmail, verifyOtp } from '../utils/utils.js';

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'postmessage'
);

// Signup route - Creates a new user account with email/password
const register = async (req, res) => {
    const { name, email, password, otp } = req.body;

    try {
        if (!name || !email || !password) return res.status(400).json({ error: 'All fields are required' });

        if (!validator.isEmail(email)) return res.status(400).json({ error: 'Invalid email format' });

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(409).json({ success: false, error: 'User already exists' });

        try {
            await verifyOtp(email, otp);
        } catch (error) {
            console.error('OTP verification failed:', error.message);
            return res.status(400).json({ success: false, error: error.message });
        }

        const newUser = await User.create({
            name,
            email,
            password,
            isGoogleAuth: false,
        });

        const token = generateToken(newUser.userId, '7d');

        res
            .cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            })
            .status(201)
            .json({
                success: true,
                token
            });
    } catch (error) {
        console.error('Error signing up', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user?.isGoogleAuth) return res.status(400).json({ error: 'Please use Google login for this account' });
        if (!user || !(await user.comparePassword(password))) return res.status(400).json({ error: 'Invalid username or password.' });

        const token = generateToken(user.userId, '7d');

        res
            .cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            })
            .json({ success: true, user: { isOnboarded: user.isOnboarded } });
    } catch (error) {
        console.error('Error logging in', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

const handleGoogleAuth = async (req, res) => {
    try {
        const { code } = req.body;

        const { tokens } = await client.getToken({
            code,
            redirect_uri: 'postmessage'
        });

        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                email,
                name,
                isGoogleAuth: true,
                avatarUrl: picture
            });
        } else {
            if (!user.isGoogleAuth) user.isGoogleAuth = true;
            if (!user.avatarUrl && picture) user.avatarUrl = picture;

            await user.save();
        }

        const token = generateToken(user.userId, '7d');

        res
            .cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            })
            .json({ success: true, user: { email, name, avatarUrl: picture, isOnboarded: user.isOnboarded } });
    } catch (error) {
        console.error('Google Auth Error: ', error.response?.data || error.message);

        const statusCode = error.response?.status || 401;
        res.status(statusCode).json({
            error: 'Authentication failed',
            details: error.response?.data?.error_description || error.message
        });
    }
};

const logout = (_req, res) => {
    try {
        res
            .clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
            })
            .status(200).json({ success: true });
    } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
    }
};

const me = async (req, res) => {
    try {
        const { userId } = req.user;

        const user = await User.findOne({ userId }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

const sendOtp = async (req, res) => {
    const { email } = req.body

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ success: false, error: 'User already exists' });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000) // 2 mins

    await Otp.create({ email, otp: otpCode, expiresAt })

    try {
        await sendOtpToEmail(email, otpCode);
        res.json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to send OTP' });
    }
}

export {
    register,
    login,
    handleGoogleAuth,
    me,
    logout,
    sendOtp
};