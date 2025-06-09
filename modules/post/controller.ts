import { Request, Response } from 'express';
import axios from 'axios';

const SearchTracks = async (req: Request, res: Response) => {
    const accessToken = req.headers['x-spotify-token'] as string;
    const { q } = req.body;
    
    if (!accessToken) {
        res.status(401).json({ error: 'Spotify access token is required in X-Spotify-Token header' });
        return;
    }

    try {
        const response = await axios.get('https://api.spotify.com/v1/search', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            params: {
                q: q,
                type: 'track',
                limit: 10
            }
        });

        res.json(response.data);
    } catch (error: any) {
        console.error('Spotify API Error:', error);
        const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to search tracks';
        res.status(500).json({ error: errorMessage });
    }
}

export { SearchTracks }; 