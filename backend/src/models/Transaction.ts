import { ObjectId } from "mongodb";
import { getDb } from "../config/db";
import { Image } from "./Image";

export interface Transaction{
    _id?: ObjectId
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
    }
};