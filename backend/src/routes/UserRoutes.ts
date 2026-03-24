import { Router, json } from "express";
import * as UserController from "../controllers/UserController"
import Auth from "src/middleware/Auth";

const router = Router();

router.post("/login", json(), UserController.login);
router.post("/register", json(), UserController.register);
router.get("/me", json(), Auth, UserController.verify);
router.post("/logout", json(), Auth, UserController.logout);

export default router;