import { Request, Response, NextFunction, request } from 'express';
import { validateToken } from '../../modules/users/auth/service'; // Fixed relative path

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  let requestUserId: string;

  if (!authHeader) {
    res.status(401).json({ message: 'Authorization header missing' });
    return;
  }

  try {
    const { userId } = req.body; 
    requestUserId = userId;
  } catch (error) {
    res.status(401).json({ message: 'Unable to extract User ID from request: ', error: error instanceof Error ? error.message : 'Unknown error' });
      return;
  }

  const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

  try {
    const tokenUserId = await validateToken(token); // Validate token using auth module
    if (tokenUserId && tokenUserId === requestUserId) {
      next();
    } else {
      res.status(403).json({ message: 'Invalid or expired token' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error ', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};
