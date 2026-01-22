import { Request, Response, NextFunction } from 'express';

/**
 * GOOD PRACTICE: Proper validation middleware using express-validator pattern
 * Validates user profile update data
 */
export const validateUserProfileUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { name, bio, age, phone } = req.body;

  // Validate name
  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name must be a non-empty string' });
    }
    if (name.length > 100) {
      return res.status(400).json({ error: 'Name must be less than 100 characters' });
    }
  }

  // Validate bio
  if (bio !== undefined && typeof bio !== 'string') {
    return res.status(400).json({ error: 'Bio must be a string' });
  }
  if (bio !== undefined && bio.length > 500) {
    return res.status(400).json({ error: 'Bio must be less than 500 characters' });
  }

  // Validate age
  if (age !== undefined) {
    if (typeof age !== 'number' || age < 0 || age > 150) {
      return res.status(400).json({ error: 'Age must be a number between 0 and 150' });
    }
  }

  // Validate phone (basic format check)
  if (phone !== undefined && phone !== null) {
    if (typeof phone !== 'string') {
      return res.status(400).json({ error: 'Phone must be a string' });
    }
    // Basic phone validation
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }
  }

  next();
};

/**
 * BAD PRACTICE – intentional: No validation, trusts req.body directly
 * SECURITY RISK – intentional: Missing input validation
 */
export const badValidateUserProfile = (req: Request, res: Response, next: NextFunction) => {
  // BAD PRACTICE – intentional: No validation, trusting req.body directly
  // This allows any data to pass through, including malicious input
  next();
};

/**
 * GOOD PRACTICE: Email validation middleware
 */
export const validateEmail = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  next();
};

/**
 * GOOD PRACTICE: Password validation middleware
 */
export const validatePassword = (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  if (typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  // Check for at least one number and one letter
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);

  if (!hasNumber || !hasLetter) {
    return res.status(400).json({ error: 'Password must contain at least one letter and one number' });
  }

  next();
};
