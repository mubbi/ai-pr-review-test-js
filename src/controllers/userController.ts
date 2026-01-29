import { Request, Response } from 'express';
import { UserService } from '../services/userService';

/**
 * GOOD PRACTICE: Thin controller
 * Controller only handles HTTP concerns, delegates business logic to service
 */
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * GOOD PRACTICE: Thin controller - delegates to service
   */
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name, bio, age, phone } = req.body;
      const user = await this.userService.createUser(email, password, name, bio, age, phone);
      
      // GOOD PRACTICE: Exclude sensitive data from response
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ message: 'User created successfully', user: userWithoutPassword });
    } catch (error: any) {
      // GOOD PRACTICE: Don't leak internal error details
      if (error.message === 'User with this email already exists') {
        res.status(409).json({ error: 'User with this email already exists' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  /**
   * GOOD PRACTICE: Thin controller
   */
  async getUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id, 10);
      const user = await this.userService.getUserProfile(userId);
      res.status(200).json(user);
    } catch (error: any) {
      if (error.message === 'User not found') {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  /**
   * GOOD PRACTICE: Thin controller
   */
  async updateUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id, 10);
      const { name, bio, age, phone } = req.body;
      const updatedUser = await this.userService.updateUserProfile(userId, { name, bio, age, phone });
      
      const { password: _, ...userWithoutPassword } = updatedUser;
      res.status(200).json({ message: 'Profile updated successfully', user: userWithoutPassword });
    } catch (error: any) {
      if (error.message === 'User not found') {
        res.status(404).json({ error: 'User not found' });
      } else if (error.message === 'Invalid age') {
        res.status(400).json({ error: 'Invalid age' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}

/**
 * BAD PRACTICE – intentional: Fat controller / route handler anti-pattern
 * This handler does everything:
 * - Validates input
 * - Executes business logic
 * - Queries database
 * - Logs
 * - Formats response
 * 
 * This violates separation of concerns and makes testing difficult
 */
export class BadUserController {
  private prisma: any;

  constructor(prisma: any) {
    this.prisma = prisma;
  }

  /**
   * BAD PRACTICE – intentional: Fat controller anti-pattern
   * This method violates single responsibility principle
   * It handles validation, business logic, data access, logging, and response formatting
   */
  async badCreateUser(req: Request, res: Response): Promise<void> {
    // BAD PRACTICE – intentional: Validation logic in controller
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // BAD PRACTICE – intentional: Hardcoded values
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password too short' });
    }

    // BAD PRACTICE – intentional: Business logic in controller
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'User exists' });
    }

    // BAD PRACTICE – intentional: Database logic in controller
    // BAD PRACTICE – intentional: Storing plain text password
    const user = await this.prisma.user.create({
      data: {
        email,
        password, // BAD PRACTICE – intentional: Plain text password
        name: name || 'Unknown',
      },
    });

    // BAD PRACTICE – intentional: Logging in controller
    console.log(`User created: ${user.id}`);

    // BAD PRACTICE – intentional: Response formatting in controller
    // BAD PRACTICE – intentional: Returning password in response
    res.status(201).json({
      success: true,
      message: 'User created',
      data: user, // BAD PRACTICE – intentional: Including password in response
    });
  }

  /**
   * BAD PRACTICE – intentional: Fat controller with all logic mixed
   */
  async badUpdateUser(req: Request, res: Response): Promise<void> {
    // BAD PRACTICE – intentional: No validation
    const userId = parseInt(req.params.id, 10);
    const updates = req.body;

    // BAD PRACTICE – intentional: Direct database access in controller
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: updates, // BAD PRACTICE – intentional: No validation, accepts any data
      });

      // BAD PRACTICE – intentional: Leaking internal error details
      res.json(user); // BAD PRACTICE – intentional: Returning password
    } catch (error: any) {
      // BAD PRACTICE – intentional: Exposing internal error details
      res.status(500).json({ 
        error: 'Database error', 
        details: error.message, // SECURITY RISK – intentional: Leaking internal error details
        stack: error.stack // SECURITY RISK – intentional: Exposing stack trace
      });
    }
  }
}
