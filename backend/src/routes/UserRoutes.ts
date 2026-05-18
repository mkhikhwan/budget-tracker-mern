import { Router, json } from "express";
import * as UserController from "../controllers/UserController"
import Auth from "../middleware/Auth";

const router = Router();

router.get("/settings", Auth, UserController.getSettings);
router.post("/settings", json(), Auth, UserController.updateSettings);

export default router;