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

export interface TransactionFilters {
    search?: string;
    type?: "expense" | "income";
    category?: string;
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
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
        return this.collection().findOne({ 
            _id : new ObjectId(id),
            isDeleted: { $ne: true }
        });
    },

    async getAllTransactionsByUserId(
        userId: string,
        page: number = 1,
        limit: number = 20,
        filters?: TransactionFilters
    ) {
        const matchQuery: any = {
            userId: new ObjectId(userId),
            isDeleted: { $ne: true }
        };

        if (filters) {
            if (filters.search) {
                matchQuery.$or = [
                    { name: { $regex: filters.search, $options: "i" } },
                    { description: { $regex: filters.search, $options: "i" } }
                ];
            }

            if (filters.type) {
                matchQuery.type = filters.type;
            }

            if (filters.category) {
                matchQuery.category = filters.category;
            }

            if (filters.startDate || filters.endDate) {
                matchQuery.date = {};
                if (filters.startDate) {
                    matchQuery.date.$gte = new Date(filters.startDate);
                }
                if (filters.endDate) {
                    matchQuery.date.$lte = new Date(filters.endDate);
                }
            }

            if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
                matchQuery.amount = {};
                if (filters.minAmount !== undefined) {
                    matchQuery.amount.$gte = filters.minAmount;
                }
                if (filters.maxAmount !== undefined) {
                    matchQuery.amount.$lte = filters.maxAmount;
                }
            }
        }

        const pipeline = [
            // 1. Filter by User ID.
            {
                $match: matchQuery
            },
            // 2. Sort by date descending (latest first)
            {
                $sort: {
                    date: -1
                }
            },
            // 3. Pagination
            {
                $skip: (page - 1) * limit
            },
            {
                $limit: limit
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