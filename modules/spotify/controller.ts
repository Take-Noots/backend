import { Request, Response } from 'express';
import axios from 'axios';
import crypto from 'crypto';
import querystring from 'querystring';
import 'dotenv/config';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

// In-memory store for code verifiers (use Redis in production)
const codeVerifierStore = new Map<string, string>();

// Generate random string for code verifier
const generateCodeVerifier = (length: number): string => {
    return crypto
        .randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};

// Generate code challenge from verifier
const generateCodeChallenge = (verifier: string): string => {
    return crypto
        .createHash('sha256')
        .update(verifier)
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
};


const Login = async (req: Request, res: Response) => {
    const state = crypto.randomBytes(16).toString('hex');
    const codeVerifier = generateCodeVerifier(128);
    const codeChallenge = generateCodeChallenge(codeVerifier);
    
    codeVerifierStore.set(state, codeVerifier);

    const scope = 'user-read-private user-read-email user-read-currently-playing';
    const params = querystring.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: scope,
        redirect_uri: REDIRECT_URI,
        state: state,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge
    });

    res.redirect(`https://accounts.spotify.com/authorize?${params}`);
}


const Callback = async (req: Request, res: Response) => {
    const { code, state, error } = req.query;
    
    if (error) {
        res.status(400).json({ error });
        return;
    }
    if (!state || !code) {
        res.status(400).json({ error: 'Invalid request' });
        return;
    }

    const codeVerifier = codeVerifierStore.get(state as string);
    if (!codeVerifier) {
        res.status(400).json({ error: 'Invalid state' });
        return;
    }

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', 
            querystring.stringify({
                code: code as string,
                redirect_uri: REDIRECT_URI,
                grant_type: 'authorization_code',
                client_id: CLIENT_ID,
                code_verifier: codeVerifier
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

        const { access_token, refresh_token, expires_in } = response.data;
        
        // Set refresh token as cookie
        res.cookie('spotify_refresh_token', refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });
        res.setHeader('x-spotify-token', access_token);
        
        res.json({ access_token, refresh_token, expires_in });
        
    } catch (error) {
        res.status(500).json({ error: 'Token exchange failed' });
    }

}


const Refresh = async (req: Request, res: Response) => {
  const refresh_token = req.cookies?.spotify_refresh_token;
  
  if (!refresh_token) {
    res.status(400).json({ error: 'Refresh token not found' });
    return;
  }
  
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', 
      querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: refresh_token as string,
        client_id: CLIENT_ID
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

    const { access_token, refresh_token: new_refresh_token } = response.data;
    
    // Update cookie with new refresh token if provided
    if (new_refresh_token) {
      res.cookie('spotify_refresh_token', new_refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });
    }
    
    res.setHeader('x-spotify-token', access_token);
    res.json({ message: 'Refresh was successful' });
    
  } catch (error) {
    res.status(500).json({ error: 'Token refresh failed' });
  }
};


const WhoAmI = async (req: Request, res: Response) => {
    const accessToken = req.headers['x-spotify-token'] as string;
    
    if (!accessToken) {
        res.status(401).json({ error: 'Spotify access token is required in X-Spotify-Token header' });
        return;
    }

    try {
        const response = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        res.json(response.data.display_name);
    } catch (error: any) {
        console.error('Spotify API Error:', error);
        const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to fetch user info';
        res.status(500).json({ error: errorMessage });
    }
}

const GetCurrentTrack = async (req: Request, res: Response) => {
    const accessToken = req.headers['x-spotify-token'] as string;
    
    if (!accessToken) {
        res.status(401).json({ error: 'Spotify access token is required in X-Spotify-Token header' });
        return;
    }

    try {
        const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (response.status === 204) {
            // No track is currently playing
            res.json({ is_playing: false });
            return;
        }

        const track = response.data;
        res.json({
            is_playing: true,
            track: {
                name: track.item.name,
                artists: track.item.artists.map((artist: any) => artist.name),
                album: track.item.album.name,
                duration_ms: track.item.duration_ms,
                progress_ms: track.progress_ms,
                is_playing: track.is_playing
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch current track' });
    }
}

export { Login, Callback, Refresh, WhoAmI, GetCurrentTrack };