const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');

// Signup route - Creates a new user account with email/password
const signUp = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        // Validate email and password (optional)
        if (!email.match(/\S+@\S+\.\S+/)) {
            return res.status(400).send('Invalid email format');
        }

        const newUser = new User({
            email,
            password,
            name,
            isGoogleAuth: false, // Not a Google login
        });

        await newUser.save();

        const token = generateToken(newUser.userId, '7d');

        // Redirect to the dashboard with the token (could also be set as a cookie)
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        res.json({ success: true });
    } catch (error) {
        console.error('Error signing up', error);
        res.status(500).send('Server error');
    }
};

// Login route (email/password)
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) return res.status(400).send('Invalid credentials');
        if (user.isGoogleAuth) return res.status(400).send('Please use Google login for this account');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invalid credentials');

        const token = generateToken(user.userId, '7d');

        // Redirect to the dashboard
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.json({ success: true });
    } catch (error) {
        console.error('Error logging in', error);
        res.status(500).send('Server error');
    }
};

const googleCallback = async (req, res) => {
    try {
        const { emails, displayName: name } = req.user;
        const [{ value: email }] = emails;

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({
                email,
                name,
                isGoogleAuth: true, // Mark as Google login
            });

            await user.save();
        }

        const token = generateToken(user.userId, '7d');

        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.redirect('http://localhost:5713')
    } catch (error) {
        console.error('Error during Google login/signup', error);
        res.status(500).send('Server error');
    }
};

// Refresh token route
const refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: 'Refresh token missing' });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid refresh token' });

        const newAccessToken = generateToken({ id: decoded.id }, '15m');
        res.json({ accessToken: newAccessToken });
    });
};

const me = (req, res) => {
    if (!req.user) {
        return res.status(401).send('Unauthorized');
    }
    res.json(req.user);
};

// Logout route (clear refresh token)
const logout = (req, res) => {
    req.logout(() => {
        res.clearCookie('token'); // Clear the token cookie on logout
        res.json({ message: 'Logged out successfully' });
    });
};

module.exports = {
    signUp,
    login,
    googleCallback,
    refreshToken,
    me,
    logout
};