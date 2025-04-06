require('dotenv').config();
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const { Strategy } = require('passport-google-oauth20');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const Mongoose = require('./mongoose');
const authRoutes = require('./routes/authRoutes.js');  // Importing the auth routes

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // if you want to allow cookies and credentials
}));

app.use(express.json());

// MongoDB connection
const mongoose = new Mongoose();
mongoose.init();

// Session management
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Secure cookie in production
        httpOnly: true,
    },
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport Google OAuth Setup
passport.use(new Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.API_URL}/auth/google/callback`,
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Auth Routes

app.use('/auth', authRoutes);

// Start server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});