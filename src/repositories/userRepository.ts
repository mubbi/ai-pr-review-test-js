import { PrismaClient, User } from '@prisma/client';

/**
 * GOOD PRACTICE: Repository pattern with dependency injection
 * Separates data access logic from business logic
 */
export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * GOOD PRACTICE: Using Prisma's type-safe queries (prevents SQL injection)
   */
  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * GOOD PRACTICE: Parameterized query via ORM
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * GOOD PRACTICE: Type-safe create operation
   */
  async create(data: { email: string; name?: string; password: string; bio?: string; age?: number; phone?: string }): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  /**
   * GOOD PRACTICE: Type-safe update operation
   */
  async update(id: number, data: Partial<{ name: string; bio: string; age: number; phone: string }>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * GOOD PRACTICE: Safe delete operation
   */
  async delete(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  /**
   * GOOD PRACTICE: Paginated list with type safety
   */
  async findAll(skip: number = 0, take: number = 10): Promise<User[]> {
    return this.prisma.user.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }
}

/**
 * BAD PRACTICE – intentional: Raw SQL with string concatenation
 * SECURITY RISK – intentional: SQL injection vulnerability
 */
export class BadUserRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * BAD PRACTICE – intentional: Using raw SQL with string concatenation
   * SECURITY RISK – intentional: Vulnerable to SQL injection
   * Example attack: email = "'; DROP TABLE users; --"
   */
  async badFindByEmail(email: string): Promise<any> {
    // BAD PRACTICE – intentional: String concatenation in SQL query
    // SECURITY RISK – intentional: SQL injection vulnerability
    return this.prisma.$queryRawUnsafe(
      `SELECT * FROM "User" WHERE email = '${email}'`
    );
  }

  /**
   * BAD PRACTICE – intentional: Raw SQL with user input
   * SECURITY RISK – intentional: SQL injection vulnerability
   */
  async badUpdateUser(id: number, name: string): Promise<any> {
    // BAD PRACTICE – intentional: Direct string interpolation in SQL
    // SECURITY RISK – intentional: SQL injection vulnerability
    return this.prisma.$queryRawUnsafe(
      `UPDATE "User" SET name = '${name}' WHERE id = ${id}`
    );
  }

  /**
   * BAD PRACTICE – intentional: No error handling, returns all fields including sensitive data
   * SECURITY RISK – intentional: May leak sensitive information
   */
  async badFindById(id: number): Promise<User | null> {
    // BAD PRACTICE – intentional: No error handling
    // SECURITY RISK – intentional: May expose internal errors to client
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}
