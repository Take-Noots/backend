import { Router } from "express";
import { Login, Refresh, Logout, Register } from "./controller";

const router = Router();

router.post('/login', Login);
router.get('/refresh', Refresh);
router.post('/logout', Logout);
router.post('/register', Register);

export default router;