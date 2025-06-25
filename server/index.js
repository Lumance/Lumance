import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import Mongoose from './mongoose.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config({
    path: path.resolve(
        process.cwd(),
        process.env.NODE_ENV === 'production'
            ? '.env.production'
            : '.env.development'
    ),
});

const app = express();

const mongoose = new Mongoose();
mongoose.init();

app.use(express.json());
app.use(cookieParser())

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true
}));

app.use(passport.initialize());

// Passport Google OAuth Setup
passport.use(new Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID, // try to destructure all the env variables from process.env above
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

app.use('/api/auth', authRoutes);

app.listen((process.env.PORT || 5000), () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});