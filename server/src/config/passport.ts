import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User';

// Local Strategy for email/password
passport.use(
    new LocalStrategy(
        { usernameField: 'email' },
        async (email: string, password: string, done: (err: any, user?: any, info?: any) => void) => {
            try {
                const user = await User.findOne({ email });
                if (!user || user.authProvider !== 'local') {
                    return done(null, false, { message: 'Invalid credentials or provider' });
                }

                const isMatch = await user.comparePassword(password);
                if (!isMatch) {
                    return done(null, false, { message: 'Invalid credentials' });
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

// Google Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || 'dummy_client_id',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy_client_secret',
            callbackURL: process.env.NODE_ENV === 'production' || process.env.RENDER === 'true'
                ? `${process.env.BACKEND_URL || 'https://api2.cyphertech.online'}/api/auth/google/callback`
                : 'http://localhost:5000/api/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ email: profile.emails?.[0].value });

                if (user) {
                    // Update googleId if not present (for users who switch from local to google)
                    if (!user.googleId) {
                        user.googleId = profile.id;
                        user.avatar = profile.photos?.[0].value;
                        await user.save();
                    }
                } else {
                    user = new User({
                        googleId: profile.id,
                        displayName: profile.displayName,
                        email: profile.emails?.[0].value,
                        avatar: profile.photos?.[0].value,
                        authProvider: 'google'
                    });
                    await user.save();
                }

                return done(null, user);
            } catch (err) {
                return done(err, undefined);
            }
        }
    )
);

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
