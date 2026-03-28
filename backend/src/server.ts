import 'dotenv/config';
import { connectDB } from './config/db';
import app from "./app"

const PORT = process.env.PORT || 5000;

const start = async ()=>{
    await connectDB();
    app.listen(PORT, ()=>{ console.log(`Server running on ${PORT}`) });
}

start();