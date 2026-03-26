import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import School from '../models/School.js';

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not set');
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-passwordHash');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // If a school_admin has no school assigned, try to find and assign the first available school
      if (!req.user.school && req.user.role === 'school_admin') {
        const school = await School.findOne({}).lean();
        if (school) {
          req.user.school = school._id;
          // Persist the school assignment on the user record
          await User.findByIdAndUpdate(req.user._id, { school: school._id });
        }
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export { protect };
