import { Router } from "express";
// import { Login, Callback, Refresh, WhoAmI, GetCurrentTrack, SearchTracks } from "./controller";
import { Login, Callback, Refresh, WhoAmI } from "./controllers/authController";
import { GetCurrentTrack, PlayTrack } from "./controllers/playerController";
import { SearchTracks } from "./controllers/searchController";



const router = Router();

// Web API routes
router.get('/login', Login);
router.get('/refresh', Refresh);
router.get('/callback', Callback);
router.get('/whoami', WhoAmI);

router.get('/search', SearchTracks);

router.get('/current-track', GetCurrentTrack);
router.put('/play', PlayTrack); 

export default router;