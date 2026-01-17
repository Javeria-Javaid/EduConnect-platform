import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';

const configurePassport = () => {
  passport.serializeUser((user, done) => {
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

  // Helper to process OAuth user
  const processOAuthUser = async (req, accessToken, refreshToken, profile, done, provider) => {
    try {
      // Get role passed in state parameter
      const role = req.query.state || 'parent'; 
      
      let email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

      if (!email) {
        return done(new Error('No email found from provider'), null);
      }

      // Check if user exists
      let user = await User.findOne({ email });

      if (user) {
        // If user exists, update provider info if missing (link account)
        if (!user[`${provider}Id`]) {
            user[`${provider}Id`] = profile.id;
            if (user.provider === 'local') {
                
            }
            await user.save();
        }
        return done(null, user);
      }

      
      const nameParts = (profile.displayName || 'User').split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'User';

      user = await User.create({
        firstName,
        lastName,
        email,
        role,
        provider,
        [`${provider}Id`]: profile.id,
      });

      done(null, user);
    } catch (err) {
      console.error(err);
      done(err, null);
    }
  };

  // Google Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || 'dummy_id',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy_secret',
        callbackURL: '/api/auth/google/callback',
        passReqToCallback: true,
      },
      (req, accessToken, refreshToken, profile, done) => {
        processOAuthUser(req, accessToken, refreshToken, profile, done, 'google');
      }
    )
  );

  // GitHub Strategy
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID || 'dummy_id',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || 'dummy_secret',
        callbackURL: '/api/auth/github/callback',
        passReqToCallback: true,
      },
      (req, accessToken, refreshToken, profile, done) => {
        processOAuthUser(req, accessToken, refreshToken, profile, done, 'github');
      }
    )
  );
};

export default configurePassport;
