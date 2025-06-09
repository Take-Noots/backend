import { Router } from "express";
import { Login, Callback, Refresh, WhoAmI } from "./controller";

const router = Router();

router.get('/login', Login);
router.get('/callback', Callback);
router.get('/refresh', Refresh);
router.get('/whoami', WhoAmI);


export default router;