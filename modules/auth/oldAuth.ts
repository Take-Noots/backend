// import express, { Request, Response } from 'express';
// import jwt from 'jsonwebtoken';
// import mongoose from 'mongoose';

// const router = express.Router();

// const myAccessToken = "owls-can-make-secret-sauce";
// const myRefreshToken = "owls-stay-fresh-af";

// interface LoginRequestBody {
//     email: string;
//     password: string;
// }

// interface User {
//     _id: mongoose.Types.ObjectId;
//     username: string;
//     email: string;
//     role: string;
//     password: string;
// }

// const UserModel = mongoose.model<User>('User', new mongoose.Schema({
//     username: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     role: { type: String, required: true },
//     password: { type: String, required: true },
// }));


// router.get('/test', async (req: Request, res: Response) => {
//     try {
//         const users = await UserModel.find();
//         res.send(users);
//     } catch (err) {
//         res.status(500).send('Database error');
//     }
// });

// router.post('/login', async (req: Request, res: Response) => {
//     const { email, password } = req.body as LoginRequestBody;

//     try {
//         const user = await UserModel.findOne({ email });

//         if (!user) {
//             res.status(401).send('Not Found');
//             return;
//         }

//         if (user.password !== password) {
//             res.status(401).send('Invalid password');
//             return;
//         }

//         const current_time = Math.floor(Date.now() / 1000);
//         const access_expiration_time = current_time + 900; // 15 minutes
//         const refresh_expiration_time = current_time + 604800; // 7 days

//         const accessClaims = {
//             sub: user._id.toString(),
//             exp: access_expiration_time,
//         };

//         const refreshClaims = {
//             sub: user._id.toString(),
//             exp: refresh_expiration_time,
//         };

//         const accessToken = jwt.sign(accessClaims, myAccessToken, { algorithm: 'HS256' });
//         const refreshToken = jwt.sign(refreshClaims, myRefreshToken, { algorithm: 'HS256' });

//         res.cookie('refresh_token', refreshToken, { httpOnly: true });
//         res.json({
//             message: 'Authentication successful',
//             accessToken: accessToken,
//             user: {
//                 name: user.username,
//                 email: user.email,
//                 role: user.role,
//             },
//         });
//     } catch (err) {
//         res.status(500).send('Database error');
//     }
// });

// router.get('/refresh', async (req: Request, res: Response) => {
//     const refresh_token = req.cookies.refreshToken;

//     if (!refresh_token) {
//         res.status(200).json({
//             message: 'Refresh token missing',
//         });
//         return;
//     }

//     jwt.verify(refresh_token, myRefreshToken, async (err: Error | null, payload: any) => {
//         if (err) {
//             res.status(403).json({ message: 'Invalid refresh token' });
//             return;
//         }

//         try {
//             const user = await UserModel.findById(payload.sub); // Use `sub` from claims

//             if (!user) {
//                 res.status(404).json({ message: 'User not found' });
//                 return;
//             }

//             // Generate new access token
//             const current_time = Math.floor(Date.now() / 1000);
//             const expiration_time = current_time + 900; // 15 minutes
//             const private_key = myAccessToken; // Use the access token as the private key
//             const claims = {
//                 sub: user._id.toString(),
//                 exp: expiration_time,
//             };

//             const accessToken = jwt.sign(claims, private_key, { algorithm: 'HS256' });

//             res.status(200).json({
//                 message: 'Token refreshed successfully',
//                 accessToken: accessToken,
//                 user: {
//                     name: user.username,
//                     email: user.email,
//                     role: user.role,
//                 },
//             });
//         } catch (err) {
//             res.status(500).json({ message: 'Database error' });
//         }
//     });
// });

// router.post('/logout', (req: Request, res: Response) => {
//     res.clearCookie('refresh_token', {
//         httpOnly: true,
//     });

//     res.status(200).json({ message: 'Logged out successfully' });
// });

// router.post('/register', async (req: Request, res: Response) => {
//     const { username, email, role, password } = req.body;

//     // Validate request body
//     if (!username || !email || !role || !password) {
//         res.status(400).json({ message: 'All fields are required' });
//         return;
//     }

//     try {
//         // Check if the email already exists
//         const existingUser = await UserModel.findOne({ email });
//         if (existingUser) {
//             res.status(409).json({ message: 'Email already exists' });
//             return;
//         }

//         // Create a new user
//         const newUser = new UserModel({ username, email, role, password });
//         await newUser.save();

//         res.status(201).json({
//             message: 'User registered successfully',
//             user: {
//                 id: newUser._id,
//                 username: newUser.username,
//                 email: newUser.email,
//                 role: newUser.role,
//             },
//         });
//     } catch (err) {
//         res.status(500).json({ message: 'Database error' });
//     }
// });

// export default router;