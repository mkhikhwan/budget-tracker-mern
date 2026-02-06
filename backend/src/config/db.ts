import { Db, MongoClient } from "mongodb";

let db: Db;

export const connectDB = async () => {
    try{
        const dbUri:string|undefined = process.env.MONGO_URI;
        if(!dbUri) throw new Error("MONGO_URI is not defined"); 

        const client = new MongoClient(dbUri);
        await client.connect();
        db = client.db(process.env.MONGO_DB_NAME);

        console.log('MongoDB connected');
    }
    catch(err) {
        console.error(err);
        process.exit(1);
    }
};

export const getDb = () => {
    if(!db) throw new Error("Database not initialized");

    return db;
};