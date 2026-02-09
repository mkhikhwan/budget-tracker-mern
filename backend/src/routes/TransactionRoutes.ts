import { Router } from "express";
import * as TransactionController from "../controllers/TransactionController"

const router = Router();

router.post("/add", TransactionController.createTransaction);

export default router;