import express from 'express';
import cors from 'cors';

import TransactionRoutes from "./routes/TransactionRoutes"

const app = express();

app.use(cors());
app.use((req, _res, next) => (console.log(req.method, req.originalUrl, req.headers), next()));

app.get("/", (req, res) => {
    res.json({ message: "Hello World" });
});

app.use("/api/transaction",TransactionRoutes);

export default app;