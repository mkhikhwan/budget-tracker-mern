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
    date: Date;
    images? : Express.Multer.File[]
    isDeleted?: boolean;
    deletedAt?: string;
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
            date: new Date(data.date!)
        }
    },

    async create(transaction: Transaction){
        return this.collection().insertOne(transaction);
    },

    async findById(id: string){
        return this.collection().findOne({ _id : new ObjectId(id) });
    },

    async getAllTransactionsByUserId(userId: string){
        const pipeline = [
            // 1. Filter by User ID.
            {
                $match: {
                    userId: new ObjectId(userId)
                }
            },
            // Include the collection "Transaction Categories" into Transaction Collection
            {
                $lookup: {
                    from: "transaction_categories",
                    localField: "category",
                    foreignField: "value",
                    as: "categoryInfo"
                }
            },
            // Unwind the array into a single object
            {
                $unwind: {
                    path: "$categoryInfo",
                    preserveNullAndEmptyArrays: true
                }
            },
            // Modify Category to proper Label
            {
                $set: {
                    category: { $ifNull: ["$categoryInfo.label", "$category"] }
                }
            },
            // Remove unnecessary key
            {
                $unset: ["categoryInfo", "userId", "description"]
            }
        ];

        return this.collection().aggregate(pipeline).toArray();
    },

    async editTransactionById(cred: Pick<Transaction, "_id" | "userId">, data: Partial<Transaction>) {
        return this.collection().updateOne(
            cred,
            { $set: data }
        );
    },

    async deleteTransactionById(cred: Pick<Transaction, "_id" | "userId">) {
        return this.collection().updateOne(
            cred,
            { $set: { isDeleted: true, deletedAt: new Date().toISOString() } }
        );
    }
};