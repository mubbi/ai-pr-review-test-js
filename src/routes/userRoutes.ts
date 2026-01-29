import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { UserRepository } from '../repositories/userRepository';
import { UserService, BadUserService } from '../services/userService';
import { UserController, BadUserController } from '../controllers/userController';
import {
  validateUserProfileUpdate,
  badValidateUserProfile,
  validateEmail,
  validatePassword,
} from '../middleware/validation';
import {
  requireAuth,
  requireOwnershipOrAdmin,
  badRequireAuth,
} from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GOOD PRACTICE: Dependency injection setup
const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// BAD PRACTICE – intentional: Bad controller with fat handler
const badUserController = new BadUserController(prisma);
const badUserService = new BadUserService(userRepository);

/**
 * GOOD PRACTICE: Secure route with proper validation and authorization
 * - Input validation middleware
 * - Authorization middleware
 * - Thin controller delegation
 */
router.post(
  '/users',
  validateEmail,
  validatePassword,
  async (req: Request, res: Response) => {
    await userController.createUser(req, res);
  }
);

/**
 * GOOD PRACTICE: Secure route with authorization
 */
router.get(
  '/users/:id',
  requireAuth,
  requireOwnershipOrAdmin,
  async (req: Request, res: Response) => {
    await userController.getUserProfile(req, res);
  }
);

/**
 * GOOD PRACTICE: Secure route with validation and authorization
 */
router.put(
  '/users/:id',
  requireAuth,
  requireOwnershipOrAdmin,
  validateUserProfileUpdate,
  async (req: Request, res: Response) => {
    await userController.updateUserProfile(req, res);
  }
);

/**
 * BAD PRACTICE – intentional: Insecure route
 * SECURITY RISK – intentional: No validation, no authorization
 */
router.post('/bad/users', badValidateUserProfile, async (req: Request, res: Response) => {
  // BAD PRACTICE – intentional: No validation, trusting req.body directly
  // SECURITY RISK – intentional: Missing authorization
  await badUserController.badCreateUser(req, res);
});

/**
 * BAD PRACTICE – intentional: Insecure route
 * SECURITY RISK – intentional: No authorization, no validation
 */
router.put('/bad/users/:id', badRequireAuth, async (req: Request, res: Response) => {
  // BAD PRACTICE – intentional: No authorization check
  // SECURITY RISK – intentional: Anyone can update any user
  await badUserController.badUpdateUser(req, res);
});

/**
 * BAD PRACTICE – intentional: Direct database access in route
 * SECURITY RISK – intentional: SQL injection vulnerability via raw query
 */
router.get('/bad/users/email/:email', async (req: Request, res: Response) => {
  try {
    // BAD PRACTICE – intentional: Using repository with SQL injection vulnerability
    const badRepo = new (await import('../repositories/userRepository')).BadUserRepository(prisma);
    const user = await badRepo.badFindByEmail(req.params.email);
    
    // BAD PRACTICE – intentional: Returning password in response
    res.json(user);
  } catch (error: any) {
    // BAD PRACTICE – intentional: Exposing internal error details
    res.status(500).json({ 
      error: error.message, // SECURITY RISK – intentional: Leaking error details
      stack: error.stack // SECURITY RISK – intentional: Exposing stack trace
    });
  }
});

/**
 * BAD PRACTICE – intentional: Fat route handler
 * All logic directly in route handler
 */
router.post('/bad/users/fat-handler', async (req: Request, res: Response) => {
  // BAD PRACTICE – intentional: Fat handler - validation in route
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  // BAD PRACTICE – intentional: Business logic in route
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: 'User exists' });
  }

  // BAD PRACTICE – intentional: Database logic in route
  // BAD PRACTICE – intentional: Plain text password
  const user = await prisma.user.create({
    data: { email, password }, // SECURITY RISK – intentional: Plain text password
  });

  // BAD PRACTICE – intentional: Logging in route
  console.log(`Created user ${user.id}`);

  // BAD PRACTICE – intentional: Response formatting in route
  res.status(201).json(user); // BAD PRACTICE – intentional: Returning password
});

export default router;
