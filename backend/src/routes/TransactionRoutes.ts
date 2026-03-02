import { Router } from "express";
import * as TransactionController from "../controllers/TransactionController"
import multer from "multer";

const router = Router();
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 }
});

router.post("/add", upload.array("images"), TransactionController.createTransaction);

router.get("/", TransactionController.getAllTransaction);
router.get("/:id", TransactionController.getTransaction);

export default router;