// import express, { Request, Response } from 'express';
// import axios from 'axios';
// import crypto from 'crypto';
// import querystring from 'querystring';
// import 'dotenv/config';

// const router = express.Router();

// // Environment variables
// const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
// const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
// const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

// // In-memory store for code verifiers (use Redis in production)
// const codeVerifierStore = new Map<string, string>();

// // Generate random string for code verifier
// const generateCodeVerifier = (length: number): string => {
//     return crypto
//         .randomBytes(Math.ceil(length / 2))
//         .toString('hex')
//         .slice(0, length);
// };

// // Generate code challenge from verifier
// const generateCodeChallenge = (verifier: string): string => {
//     return crypto
//         .createHash('sha256')
//         .update(verifier)
//         .digest('base64')
//         .replace(/=/g, '')
//         .replace(/\+/g, '-')
//         .replace(/\//g, '_');
// };

// // Initiate authorization flow
// router.get('/login', (req: Request, res: Response) => {
//     const state = crypto.randomBytes(16).toString('hex');
//     const codeVerifier = generateCodeVerifier(128);
//     const codeChallenge = generateCodeChallenge(codeVerifier);
    
//     codeVerifierStore.set(state, codeVerifier);

//     const scope = 'user-read-private user-read-email';
//     const params = querystring.stringify({
//         response_type: 'code',
//         client_id: CLIENT_ID,
//         scope: scope,
//         redirect_uri: REDIRECT_URI,
//         state: state,
//         code_challenge_method: 'S256',
//         code_challenge: codeChallenge
//     });

//     res.redirect(`https://accounts.spotify.com/authorize?${params}`);
// });

// // Handle authorization callback
// router.get('/callback', async (req: Request, res: Response) => {
//     const { code, state, error } = req.query;
    
//     if (error) {
//         res.status(400).json({ error });
//         return;
//     }
//     if (!state || !code) {
//         res.status(400).json({ error: 'Invalid request' });
//         return;
//     }

//     const codeVerifier = codeVerifierStore.get(state as string);
//     if (!codeVerifier) {
//         res.status(400).json({ error: 'Invalid state' });
//         return;
//     }

//     try {
//         const response = await axios.post('https://accounts.spotify.com/api/token', 
//             querystring.stringify({
//                 code: code as string,
//                 redirect_uri: REDIRECT_URI,
//                 grant_type: 'authorization_code',
//                 client_id: CLIENT_ID,
//                 code_verifier: codeVerifier
//             }), {
//                 headers: {
//                     'Content-Type': 'application/x-www-form-urlencoded'
//                 }
//             });

//         const { access_token, refresh_token, expires_in } = response.data;
        
//         // Store tokens securely (implementation specific)
//         // Return tokens to client or handle as needed
//         res.json({ access_token, refresh_token, expires_in });
        
//     } catch (error) {
//         res.status(500).json({ error: 'Token exchange failed' });
//     }
// });

// router.get('/whoami', async (req: Request, res: Response) => {
//     const accessToken = req.headers['x-spotify-token'] as string;
    
//     if (!accessToken) {
//         res.status(401).json({ error: 'Spotify access token is required in X-Spotify-Token header' });
//         return;
//     }

//     try {
//         const response = await axios.get('https://api.spotify.com/v1/me', {
//             headers: {
//                 Authorization: `Bearer ${accessToken}`
//             }
//         });

//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to fetch user info' });
//     }
// });

// export default router;
