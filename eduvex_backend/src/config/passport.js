import dotenv from "dotenv"
dotenv.config()

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log(profile,'333333333333333333ee')

                if (!profile.emails) {
                    return done(new Error("Google account has no email"), null);
                }

                if (!profile.emails[0].verified) {
                    return done(new Error("Email not verified"), null);
                }

                // let user = await User.findOne({ email: profile.emails[0].value });
                // console.log(user,'uuuuuuuuuuuuuuuu')
                // if (!user) {
                    return done(null, profile);
                // }
                // return done(null, user);

            } catch (error) {
                return done(error, null);
            }
        }
    )
)

passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser((user, done) => done(null, user));