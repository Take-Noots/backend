import { Request, Response } from 'express';
import axios from 'axios';

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

const PlayTrack = async (req: Request, res: Response) => {
    const accessToken = req.headers['x-spotify-token'] as string;
    const { track_id, track_position = 0 } = req.body;
    

    if (!accessToken) {
        res.status(401).json({ error: 'Spotify access token is required in X-Spotify-Token header' });
        return;
    }

    try {
        const response = await axios.put('https://api.spotify.com/v1/me/player/play',
            {        
                uris: [`spotify:track:${track_id}`],
                position_ms: track_position
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        res.json({ is_playing: true });
    } catch (error: any) {
        const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to search tracks';
        console.error(error.status, errorMessage);
        res.status(500).json({ error: errorMessage });
    }
}




export { GetCurrentTrack, PlayTrack };