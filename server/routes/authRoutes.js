import express from 'express';
const router = express.Router();
import passport from 'passport';
import { registerUser, loginUser, getMe, oauthCallback } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

// OAuth Routes
// Google
router.get('/google', (req, res, next) => {
  const role = req.query.role || 'student'; // Default role if not specified
  const state = JSON.stringify({ role });
  passport.authenticate('google', { scope: ['profile', 'email'], state })(req, res, next);
});

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }), 
  oauthCallback
);

// GitHub
router.get('/github', (req, res, next) => {
    const role = req.query.role || 'student';
    const state = JSON.stringify({ role });
    passport.authenticate('github', { scope: ['user:email'], state })(req, res, next);
});

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }), 
  oauthCallback
);

export default router;
