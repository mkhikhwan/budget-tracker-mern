import { Router } from "express";
import * as TransactionController from "../controllers/TransactionController"
import multer from "multer";
import path from 'path'

const router = Router();
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});

router.post("/add", upload.array("images"), TransactionController.createTransaction);

router.get("/", TransactionController.getAllTransaction);
router.get("/:id", TransactionController.getTransaction);

export default router;