import { ObjectId } from "mongodb";
import { getDb } from "../config/db";
import { Image } from "./Image";

export interface Transaction{
    _id?: ObjectId
    type: string
    name: string
    category: string
    description: string
    date: string
    images: Image[]
}

const COLLECTION = "transactions"

export const TransactionModel = {
    collection (){
        return getDb().collection<Transaction>(COLLECTION);
    }
};