import { Request, Response, NextFunction } from 'express';

/**
 * GOOD PRACTICE: Authorization middleware
 * Checks if user is authenticated and authorized to access resource
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  // GOOD PRACTICE: Proper authorization check
  const userId = req.headers['x-user-id'] as string;
  const userRole = req.headers['x-user-role'] as string;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID required' });
  }

  // Store user info in request for downstream handlers
  (req as any).userId = parseInt(userId, 10);
  (req as any).userRole = userRole;

  next();
};

/**
 * GOOD PRACTICE: Role-based authorization
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const userRole = (req as any).userRole;

  if (userRole !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }

  next();
};

/**
 * GOOD PRACTICE: Check if user can access their own resource
 */
export const requireOwnershipOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).userId;
  const userRole = (req as any).userRole;
  const targetUserId = parseInt(req.params.id, 10);

  if (isNaN(targetUserId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  // Allow if user is accessing their own resource or is admin
  if (userId !== targetUserId && userRole !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Cannot access other user resources' });
  }

  next();
};

/**
 * BAD PRACTICE – intentional: Missing authorization
 * SECURITY RISK – intentional: No authentication/authorization check
 */
export const badRequireAuth = (req: Request, res: Response, next: NextFunction) => {
  // BAD PRACTICE – intentional: No authorization check
  // SECURITY RISK – intentional: Anyone can access protected routes
  next();
};
