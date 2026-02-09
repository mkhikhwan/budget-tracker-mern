import app from "./app"
import dotenv from 'dotenv';
import { connectDB } from './config/db';

dotenv.config();

const PORT = process.env.PORT || 5000;

const start = async ()=>{
    await connectDB();
    app.listen(PORT, ()=>{ console.log(`Server running on ${PORT}`) });
}

start();