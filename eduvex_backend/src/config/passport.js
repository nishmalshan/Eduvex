import dotenv from "dotenv"
dotenv.config()

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../models/User.js';


// ─── Google Strategy ───────────────────────────────────────────────
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
                    return done(null, profile);

            } catch (error) {
                return done(error, null);
            }
        }
    )
)

// ─── Facebook Strategy ─────────────────────────────────────────────
passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: process.env.FACEBOOK_CALLBACK_URL,
            profileFields: ['id', 'displayName', 'photos', 'email'],  // request email explicitly
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log(profile, 'facebook-profile')

                // Facebook may not return email if user signed up with phone number
                if (!profile.emails || profile.emails.length === 0) {
                    return done(new Error("Facebook account has no email. Please use an account with an email address."), null);
                }

                // Note: Facebook doesn't have an email 'verified' field like Google
                // Facebook emails are considered trusted since they verify during signup

                return done(null, profile);

            } catch (error) {
                return done(error, null);
            }
        }
    )
)

// ─── Serialize / Deserialize ───────────────────────────────────────
// Passing raw profile (same for both Google & Facebook)
passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser((user, done) => done(null, user));