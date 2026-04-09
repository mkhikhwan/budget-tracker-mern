import { ObjectId, WithId } from "mongodb"
import { TransactionModel, Transaction } from "../models/Transaction"
import AppError from "../utils/AppError";
import { getDb } from "../config/db";
import { TransactionCategoryModel } from "../models/TransactionCategory";

export const getFiveLatestTransactions = async (userId: string):Promise<WithId<Transaction>[]> => {
    try{
        const transactionCollection = TransactionModel.collection();

        const result = await transactionCollection
            .find({ userId: new ObjectId(userId) })
            .project({ userId: 0, description: 0 })
            .sort({ date: -1 })
            .limit(5)
            .toArray();

        return result as WithId<Transaction>[];
    } catch (err) {
        throw new AppError("Failed to fetch transactions", 500);
    }
}

export const getLatestBalance = async (userId: string) => {
    try {
        const pipeline = [
            {
                $match: { userId: new ObjectId(userId) }
            },
            {
                $group: {
                    _id: null,
                    sumExpense: {
                        $sum: {
                            $cond: [
                                { $eq: ['$type', 'expense'] },
                                '$amount',
                                0
                            ]
                        }
                    },
                    sumIncome: {
                        $sum: {
                            $cond: [
                                { $eq: ['$type', 'income'] },
                                '$amount',
                                0
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalExpense: '$sumExpense',
                    totalIncome: '$sumIncome',
                    balance: {
                        $subtract: ['$sumIncome', '$sumExpense']
                    }
                }
            }
        ];

        const result = await TransactionModel.collection().aggregate(pipeline).toArray();
        
        return result[0] || {
            totalExpense: 0,
            totalIncome: 0,
            balance: 0
        };
    } catch (err) {
        throw new AppError("Failed to fetch balance", 500);
    }
};

export const getExpenseBreakdownByCategory = async (userId: string) => {
    try {
        const pipeline = [
            {
                $match: { type: 'expense' }
            },
            {
                $lookup: {
                    from: 'transactions',
                    let: { catValue: '$value' },
                    pipeline: [
                        { 
                            $match: { 
                                $expr: { 
                                    $and: [{ $eq: ['$category', '$$catValue'] }, { $eq: ['$userId', new ObjectId(userId)] }] 
                                } 
                            } 
                        }
                    ],
                    as: 'transactions'
                }
            },
            {
                $set: {
                    total: {
                        $sum: '$transactions.amount'
                    }
                }
            },
            {
                $unset: ['transactions', 'type']
            }
        ];
        
        return TransactionCategoryModel.collection().aggregate(pipeline).toArray();
    } catch (err) {
        throw new AppError("Failed to fetch expense breakdown", 500);
    }
};

export const getExpensesByMonth = async (userId: string, year: number) => {
    try {
        const pipeline = [
            {
                $match: {
                    userId: new ObjectId(userId),
                    type: 'expense',
                    $expr: {
                        $eq: [{ $year: "$date" }, year]
                    }
                }
            },
            {
                $group: {
                    _id: { $month: "$date" },
                    total: { $sum: "$amount" }
                }
            },
            {
                $sort: { "_id": 1 } as const
            }
        ];

        const result = await TransactionModel.collection().aggregate(pipeline).toArray();
        
        // Map to ensure all 12 months are represented
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const formattedResult = [];
        for (let index = 0; index < months.length; index++) {
            const monthData = result.find(r => r._id === index + 1);
            const total = monthData ? monthData.total : 0;
            
            if (total === 0) break;
            
            formattedResult.push({ month: months[index], total });
        }
        return formattedResult;
    } catch (err) {
        throw new AppError(`Failed to fetch monthly expenses: ${err instanceof Error ? err.message : String(err)}`, 500);
    }
};