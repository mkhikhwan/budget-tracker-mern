import { ObjectId } from "mongodb";
import { getDb } from "../config/db";

export interface Transaction{
    _id?: ObjectId
    userId: ObjectId
    type: "expense" | "income";
    name: string;
    amount: number;
    category: string;
    description: string;
    date: string
    images? : Express.Multer.File[]
}

const COLLECTION = "transactions"

export const TransactionModel = {
    collection (){
        return getDb().collection<Transaction>(COLLECTION);
    },

    async prepareTransaction (data:Partial<Transaction>): Promise<Transaction>{
        return {
            _id: new ObjectId(),
            userId: data.userId!,
            type: data.type!,
            name: data.name!,
            amount: data.amount!,
            category: data.category!,
            description: data.description!,
            date: data.date!
        }
    },

    async create(transaction: Transaction){
        return this.collection().insertOne(transaction);
    },

    async findById(id: string){
        return this.collection().findOne({ _id : new ObjectId(id) });
    },

    async getAllTransactionsByUserId(userId: string){
        return this.collection()
            .find({ userId: new ObjectId(userId) }, { projection: { description: 0 }})
            .toArray();
    }
};