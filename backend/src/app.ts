import express from 'express';
import path from 'path';

import cors from 'cors';
import globalErrorHandler from './middleware/globalErrorHandler';

import TransactionRoutes from "./routes/TransactionRoutes"
import UserRoutes from "./routes/UserRoutes"

const app = express();

app.use(cors());
app.use((req, _res, next) => (console.log(req.method, req.originalUrl, req.headers), next()));

app.get("/", (req, res) => {
    res.json({ message: "Hello World" });
});

app.use("/api/auth", UserRoutes);
app.use("/api/transaction",TransactionRoutes);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(globalErrorHandler);

export default app;