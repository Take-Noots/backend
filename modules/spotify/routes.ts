import { Router } from "express";
// import { Login, Callback, Refresh, WhoAmI, GetCurrentTrack, SearchTracks } from "./controller";
import { Login, Callback, Refresh, WhoAmI } from "./controllers/authController";
import { GetCurrentTrack, PlayTrack } from "./controllers/playerController";
import { SearchArtistsFamousTracks, SearchTracks } from "./controllers/searchController";



const router = Router();

// Web API routes
router.get('/login', Login);
router.get('/refresh', Refresh);
router.get('/callback', Callback);
router.get('/whoami', WhoAmI);

router.get('/search', SearchTracks);
router.get('/search-artists-famous-tracks', SearchArtistsFamousTracks);

router.get('/current-track', GetCurrentTrack);
router.put('/play', PlayTrack);

router.post('/search', SearchTracks);

export default router;