import { UserRepository } from '../repositories/userRepository';
import * as bcrypt from 'bcrypt';

/**
 * GOOD PRACTICE: Service layer with dependency injection
 * Handles business logic separately from data access
 */
export class UserService {
  constructor(private userRepository: UserRepository) {}

  /**
   * GOOD PRACTICE: Business logic in service layer
   * GOOD PRACTICE: Proper password hashing with bcrypt
   */
  async createUser(email: string, password: string, name?: string, bio?: string, age?: number, phone?: string) {
    // GOOD PRACTICE: Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // GOOD PRACTICE: Hash password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // GOOD PRACTICE: Delegate data access to repository
    return this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      bio,
      age,
      phone,
    });
  }

  /**
   * GOOD PRACTICE: Business logic for updating user profile
   */
  async updateUserProfile(userId: number, updates: { name?: string; bio?: string; age?: number; phone?: string }) {
    // GOOD PRACTICE: Check if user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // GOOD PRACTICE: Business logic validation
    if (updates.age !== undefined && (updates.age < 0 || updates.age > 150)) {
      throw new Error('Invalid age');
    }

    // GOOD PRACTICE: Delegate to repository
    return this.userRepository.update(userId, updates);
  }

  /**
   * GOOD PRACTICE: Business logic for getting user profile
   * GOOD PRACTICE: Exclude sensitive data from response
   */
  async getUserProfile(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // GOOD PRACTICE: Exclude sensitive data (password) from response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * GOOD PRACTICE: Business logic for authentication
   */
  async authenticateUser(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // GOOD PRACTICE: Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // GOOD PRACTICE: Return user without sensitive data
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

/**
 * BAD PRACTICE – intentional: Storing password in plain text
 * SECURITY RISK – intentional: No password hashing
 */
export class BadUserService {
  constructor(private userRepository: UserRepository) {}

  /**
   * BAD PRACTICE – intentional: Storing password in plain text
   * SECURITY RISK – intentional: Passwords not hashed
   */
  async badCreateUser(email: string, password: string, name?: string) {
    // BAD PRACTICE – intentional: Storing password in plain text
    // SECURITY RISK – intentional: No password hashing
    return this.userRepository.create({
      email,
      password, // BAD PRACTICE – intentional: Plain text password
      name,
    });
  }

  /**
   * BAD PRACTICE – intentional: Returning sensitive data
   * SECURITY RISK – intentional: Leaking password in response
   */
  async badGetUserProfile(userId: number) {
    // BAD PRACTICE – intentional: Returning user with password
    // SECURITY RISK – intentional: Leaking sensitive data
    return this.userRepository.findById(userId);
  }

  /**
   * BAD PRACTICE – intentional: Plain text password comparison
   * SECURITY RISK – intentional: No secure password verification
   */
  async badAuthenticateUser(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // BAD PRACTICE – intentional: Plain text password comparison
    // SECURITY RISK – intentional: Insecure authentication
    if (user.password !== password) {
      throw new Error('Invalid credentials');
    }

    return user; // BAD PRACTICE – intentional: Returning password in response
  }
}

/**
 * SOLID VIOLATION – intentional: Single Responsibility Principle violation
 * This class handles multiple responsibilities:
 * - User management
 * - Email sending
 * - Logging
 * - Caching
 */
export class UserManager {
  private cache: Map<number, any> = new Map();

  constructor(private userRepository: UserRepository) {}

  // Responsibility 1: User management
  async getUser(id: number) {
    return this.userRepository.findById(id);
  }

  // Responsibility 2: Email sending (should be separate service)
  async sendWelcomeEmail(email: string) {
    // BAD PRACTICE – intentional: Mixing email logic with user management
    console.log(`Sending welcome email to ${email}`);
    // In real code, this would send an actual email
  }

  // Responsibility 3: Logging (should be separate service)
  async logUserAction(userId: number, action: string) {
    // BAD PRACTICE – intentional: Mixing logging with user management
    console.log(`User ${userId} performed action: ${action}`);
  }

  // Responsibility 4: Caching (should be separate service)
  async getCachedUser(id: number) {
    if (this.cache.has(id)) {
      return this.cache.get(id);
    }
    const user = await this.userRepository.findById(id);
    this.cache.set(id, user);
    return user;
  }
}

/**
 * GOOD PRACTICE: SOLID compliance - Single Responsibility Principle
 * Each class has a single, well-defined responsibility
 */
export interface IEmailService {
  sendWelcomeEmail(email: string): Promise<void>;
}

export interface ILoggerService {
  log(message: string): void;
}

export interface ICacheService {
  get<T>(key: number): T | undefined;
  set<T>(key: number, value: T): void;
}

/**
 * GOOD PRACTICE: SOLID compliance - Dependency Inversion Principle
 * Depends on abstractions (interfaces) rather than concrete implementations
 */
export class GoodUserService {
  constructor(
    private userRepository: UserRepository,
    private emailService: IEmailService,
    private loggerService: ILoggerService,
    private cacheService: ICacheService
  ) {}

  async createUser(email: string, password: string, name?: string) {
    // GOOD PRACTICE: Single responsibility - only user creation logic
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create({ email, password: hashedPassword, name });

    // GOOD PRACTICE: Delegating to specialized services
    await this.emailService.sendWelcomeEmail(email);
    this.loggerService.log(`User created: ${email}`);

    return user;
  }

  async getUser(id: number) {
    // GOOD PRACTICE: Using cache service abstraction
    const cached = this.cacheService.get(id);
    if (cached) {
      return cached;
    }

    const user = await this.userRepository.findById(id);
    if (user) {
      this.cacheService.set(id, user);
    }
    return user;
  }
}
