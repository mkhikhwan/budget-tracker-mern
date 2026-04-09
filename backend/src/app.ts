import express from 'express';
import path from 'path';

import cors from 'cors';
import cookieParser from 'cookie-parser';
import ErrorHandler from './middleware/ErrorHandler';
import Auth from './middleware/Auth';
import morgan from 'morgan'

import TransactionRoutes from "./routes/TransactionRoutes"
import UserRoutes from "./routes/UserRoutes"
import DashboardRoutes from "./routes/DashboardRoutes"

const app = express();

// CORS Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? "http://localhost:5000" : "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());

// Server Logger Middleware
morgan.token('payload', (req:unknown, _res) => {
    const request = req as Request; 
    return JSON.stringify(request.body) || '-';
});
const format: string = ':method :url :status :res[content-length] - :response-time ms :payload';
app.use(morgan(format));

// ROUTES
app.use("/api/auth", UserRoutes);
app.use("/api/transaction", Auth, TransactionRoutes);
app.use("/api/dashboard", Auth, DashboardRoutes);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

if(process.env.NODE_ENV === "production"){
    console.log("!!! RUNNING IN PRODUCTION MODE !!!\n");
    
    const frontend = path.join(process.cwd(), "../frontend/dist");
    app.use(express.static(frontend));

    app.get("*path", (req, res) => {
        res.sendFile(path.join(frontend, "index.html"));
    });
}

// Error Handler Middleware
app.use(ErrorHandler);

export default app;