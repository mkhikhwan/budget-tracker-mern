import { ObjectId } from "mongodb"
import { TransactionModel, Transaction } from "../models/Transaction"

export const createTransaction = async ({type, name, amount, category, description, date, images}:Transaction)=>{
    try{
        const transaction: Transaction = {
            type,
            name,
            amount,
            category,
            description,
            date,
            images
        };

        const result = await TransactionModel.collection().insertOne(transaction);
        return { ...transaction, _id: result.insertedId};
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : String(err));
    }
};