
// export const authenticateJWT = async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.status(401).json({ message: 'Authorization header missing' });
//   }

//   const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

//   try {
//     // Send token to auth microservice for validation
//     const response = await axios.post(`${AUTH_SERVICE_URL}/validate-token`, { token });

//     if (response.status === 200) {
//       req.user = response.data; // Attach user info from auth service response
//       next();
//     } else {
//       res.status(403).json({ message: 'Invalid or expired token' });
//     }
//   } catch (error) {
//     res.status(403).json({ message: 'Failed to validate token' });
//   }
// };
