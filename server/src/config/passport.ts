import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User';

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || 'dummy_client_id',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy_client_secret',
            callbackURL: '/api/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ googleId: profile.id });

                if (!user) {
                    user = new User({
                        googleId: profile.id,
                        displayName: profile.displayName,
                        email: profile.emails?.[0].value,
                        avatar: profile.photos?.[0].value,
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
