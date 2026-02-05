import { MongoClient } from "mongodb";

const connectDB = async () => {
    try{
        const dbUri:string|undefined = process.env.MONGO_URI;
        if(!dbUri) throw new Error("MONGO_URI is not defined"); 

        const client = new MongoClient(dbUri);
        await client.connect();
        console.log('MongoDB connected');
    }
    catch(err) {
        console.error(err);
        process.exit(1);
    }
};

export default connectDB