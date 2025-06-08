// import { Request, Response, NextFunction } from 'express';
// import { validateToken } from '../auth'; // Import validateToken from auth module

// export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.status(401).json({ message: 'Authorization header missing' });
//   }

//   const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

//   try {
//     const user = await validateToken(token); // Validate token using auth module
//     if (user) {
//       req.user = user; // Attach user info
//       next();
//     } else {
//       res.status(403).json({ message: 'Invalid or expired token' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Internal server error', error: error.message });
//   }
// };
