import { Db, MongoClient, MongoClientOptions } from "mongodb";

let db: Db;
let client: MongoClient;

export const connectDB = async () => {
    try{
        const dbUri:string|undefined = process.env.MONGO_URI;
        if(!dbUri) throw new Error("MONGO_URI is not defined"); 

        client = new MongoClient(dbUri);
        await client.connect();

        const dbName = process.env.NODE_ENV === "test" 
            ? process.env.MONGO_DB_NAME_TESTING 
            : process.env.MONGO_DB_NAME;

        db = client.db(dbName);

        console.log('MongoDB connected');
    }
    catch(err) {
        console.error(err);
        process.exit(1);
    }
};

export const disconnectDB = async () => {
    if (client) {
        await client.close();
    }
};

export const getDb = () => {
    if(!db) throw new Error("Database not initialized");

    return db;
};