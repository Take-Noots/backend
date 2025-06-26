import { Router } from "express";
import { getAlbumArts } from "./controller";

const router = Router();

router.get("/album-arts", getAlbumArts);

export default router;
