/**
 * YAGNI VIOLATION – intentional: You Aren't Gonna Need It
 * This file contains over-engineered abstractions that are not currently used
 * These violate the YAGNI principle by adding complexity before it's needed
 */

/**
 * YAGNI VIOLATION – intentional: Unused interface abstraction
 * This interface is defined but never actually used in the codebase
 * Over-engineering for a feature that doesn't exist yet
 */
export interface IUserRepository {
  findById(id: number): Promise<any>;
  findByEmail(email: string): Promise<any>;
  create(data: any): Promise<any>;
  update(id: number, data: any): Promise<any>;
  delete(id: number): Promise<any>;
  findAll(skip: number, take: number): Promise<any[]>;
}

/**
 * YAGNI VIOLATION – intentional: Unused factory pattern
 * This factory is created but never used anywhere
 * Premature abstraction for a feature that may never be needed
 */
export class UserRepositoryFactory {
  static create(type: 'prisma' | 'sequelize' | 'mongoose'): IUserRepository {
    // YAGNI VIOLATION – intentional: Over-engineered factory for unused feature
    switch (type) {
      case 'prisma':
        // Implementation would go here
        throw new Error('Not implemented');
      case 'sequelize':
        // Implementation would go here
        throw new Error('Not implemented');
      case 'mongoose':
        // Implementation would go here
        throw new Error('Not implemented');
      default:
        throw new Error('Unknown repository type');
    }
  }
}

/**
 * YAGNI VIOLATION – intentional: Unused caching layer
 * This caching service is implemented but never actually used
 * Premature optimization for a feature that may not be needed
 */
export class UserCacheService {
  private cache: Map<number, { data: any; timestamp: number }> = new Map();
  private readonly TTL = 3600000; // 1 hour

  // YAGNI VIOLATION – intentional: Caching layer not used anywhere
  set(key: number, value: any): void {
    this.cache.set(key, {
      data: value,
      timestamp: Date.now(),
    });
  }

  // YAGNI VIOLATION – intentional: Unused cache retrieval
  get(key: number): any | null {
    const cached = this.cache.get(key);
    if (!cached) {
      return null;
    }

    if (Date.now() - cached.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  // YAGNI VIOLATION – intentional: Unused cache invalidation
  invalidate(key: number): void {
    this.cache.delete(key);
  }

  // YAGNI VIOLATION – intentional: Unused cache clearing
  clear(): void {
    this.cache.clear();
  }
}

/**
 * YAGNI VIOLATION – intentional: Unused event system
 * This event emitter is created but never used
 * Over-engineering for events that may never be needed
 */
export class UserEventEmitter {
  private listeners: Map<string, Array<(data: any) => void>> = new Map();

  // YAGNI VIOLATION – intentional: Event system not used anywhere
  on(event: string, callback: (data: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  // YAGNI VIOLATION – intentional: Unused event emission
  emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // YAGNI VIOLATION – intentional: Unused event removal
  off(event: string, callback: (data: any) => void): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
}

/**
 * YAGNI VIOLATION – intentional: Unused strategy pattern
 * This strategy pattern is implemented but never used
 * Premature abstraction for different user types that don't exist yet
 */
export interface IUserStrategy {
  calculateDiscount(price: number): number;
  getPermissions(): string[];
}

export class RegularUserStrategy implements IUserStrategy {
  // YAGNI VIOLATION – intentional: Strategy not used anywhere
  calculateDiscount(price: number): number {
    return price;
  }

  getPermissions(): string[] {
    return ['read'];
  }
}

export class PremiumUserStrategy implements IUserStrategy {
  // YAGNI VIOLATION – intentional: Strategy not used anywhere
  calculateDiscount(price: number): number {
    return price * 0.9; // 10% discount
  }

  getPermissions(): string[] {
    return ['read', 'write'];
  }
}

export class AdminUserStrategy implements IUserStrategy {
  // YAGNI VIOLATION – intentional: Strategy not used anywhere
  calculateDiscount(price: number): number {
    return price * 0.8; // 20% discount
  }

  getPermissions(): string[] {
    return ['read', 'write', 'admin'];
  }
}

/**
 * YAGNI VIOLATION – intentional: Unused builder pattern
 * This builder is created but never used
 * Over-engineering for user creation that doesn't need this complexity
 */
export class UserBuilder {
  private user: any = {};

  // YAGNI VIOLATION – intentional: Builder pattern not used anywhere
  withEmail(email: string): UserBuilder {
    this.user.email = email;
    return this;
  }

  withName(name: string): UserBuilder {
    this.user.name = name;
    return this;
  }

  withPassword(password: string): UserBuilder {
    this.user.password = password;
    return this;
  }

  build(): any {
    return this.user;
  }
}
