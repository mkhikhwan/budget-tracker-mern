import express from 'express';
import path from 'path';

import cors from 'cors';
import cookieParser from 'cookie-parser';
import GlobalErrorHandler from './middleware/GlobalErrorHandler';
import Auth from './middleware/Auth';
import morgan from 'morgan'


import TransactionRoutes from "./routes/TransactionRoutes"
import UserRoutes from "./routes/UserRoutes"

const app = express();

app.use(cors({
    origin: "http://localhost:5173", // Default Vite port
    credentials: true
}));
app.use(cookieParser());

morgan.token('payload', (req:unknown, _res) => {
    const request = req as Request; 
    return JSON.stringify(request.body) || '-';
});
const format: string = ':method :url :status :res[content-length] - :response-time ms :payload';
app.use(morgan(format));

// app.use((req, _res, next) => (
//     console.log(req.method, req.originalUrl, req.headers), next()
// ));

app.get("/test", (req, res) => {
    res.json({ message: "Hello World" });
});

app.use("/api/auth", UserRoutes);
app.use("/api/transaction", Auth, TransactionRoutes);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(GlobalErrorHandler);

export default app;