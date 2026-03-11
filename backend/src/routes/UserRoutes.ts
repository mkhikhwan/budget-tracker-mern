import { Router, json } from "express";
import * as UserController from "../controllers/UserController"

const router = Router();

router.post("/login", json(), UserController.login);
router.post("/register", json(), UserController.register);

export default router;