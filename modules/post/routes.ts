import { Router } from "express";
import { SearchTracks } from "./controller";

const router = Router();

router.get('/search', SearchTracks);

export default router; 