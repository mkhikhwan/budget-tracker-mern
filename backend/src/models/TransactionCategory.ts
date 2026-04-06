import { ObjectId } from "mongodb";
import { getDb } from "../config/db";

export interface TransactionCategory {
    _id?: ObjectId;
    type: "expense" | "income";
    value: string;
    label: string;
}

const COLLECTION = "transaction_categories";

export const TransactionCategoryModel = {
    collection() {
        return getDb().collection<TransactionCategory>(COLLECTION);
    },

    async getAllByType(type: "expense" | "income") {
        return this.collection()
            .find({ type })
            .toArray();
    },

    async getAll() {
        return this.collection().find({}).toArray();
    },

    async getByLabel(label: string) {
        return this.collection().findOne({ label });
    },

    async create(category: TransactionCategory) {
        return this.collection().insertOne(category);
    }
};