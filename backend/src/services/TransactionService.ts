import { ObjectId, WithId } from "mongodb"
import { TransactionModel, Transaction, TransactionFilters } from "../models/Transaction"
import { Image, ImageModel } from "../models/Image";
import { TransactionCategoryModel } from "../models/TransactionCategory";
import AppError from "../utils/AppError";

export const createTransaction = async (
    userId: string,
    type: string,
    name: string,
    amount: number,
    category: string,
    description: string,
    date: Date
)=>{
    try {
        const newTransaction = await TransactionModel.prepareTransaction({
            userId: new ObjectId(userId),
            type : type === "expense" ? "expense" : "income",
            name,
            amount,
            category,
            description,
            date
        });

        const result = await TransactionModel.create(newTransaction);
        return result.insertedId;
    } catch (err) {
        throw new AppError("Failed to create transaction", 500);
    }
};

export const addImagesToTransaction = async (transactionId: string, images: Express.Multer.File[]) => {
    try {
        if (images && images.length > 0) {
            const imageDocs = images.map((img) => {
                const newImg: Omit<Image, "_id"> = {
                    transactionId: new ObjectId(transactionId),
                    filename: img.filename,
                    path: img.path,
                    mimetype: img.mimetype,
                    size: img.size,
                    uploadedAt: new Date().toISOString()
                };

                return newImg;
            });

            const result = await ImageModel.collection().insertMany(imageDocs);
            return result;
        }
        
        return { acknowledged: true, insertedCount: 0 };
    } catch (err) {
        console.error(err);
        throw new Error(err instanceof Error ? err.message : String(err));
    }
}

export const deleteImages = async (idToDelete:string[])=>{
    try{
        const idArray = Array.isArray(idToDelete) ? idToDelete : [idToDelete];
        const result = await ImageModel.collection()
            .updateMany({
                _id : {
                    $in : idArray.map((id) => new ObjectId(id))
                }
            },{
                $set : {
                    isDeleted : true,
                    deletedAt : new Date().toISOString()
                }
            })
        
        return
    } catch (err) {
        console.error(err);
        throw new Error(err instanceof Error ? err.message : String(err));
    }
}

export const getAllTransaction = async (
    userId: string,
    page?: number,
    filters?: TransactionFilters
): Promise<WithId<Transaction>[]> => {
    try {
        const result = await TransactionModel.getAllTransactionsByUserId(userId, page, 20, filters);
        return result as unknown as WithId<Transaction>[];
    } catch (err) {
        throw new AppError("Failed to fetch transactions", 500);
    }
}

export const getTransactionDetails = async (id: string) => {
    try{
        const transactionResult = await TransactionModel.collection()
            .findOne({ _id: new ObjectId(id), isDeleted: { $ne: true } });

        if(!transactionResult){
            throw new AppError("Transaction not found", 404);
        }

        const imageResult = await ImageModel.collection()
            .find({ 
                transactionId: new ObjectId(id), 
                $or: [
                    { isDeleted: false },
                    { isDeleted: { $exists: false } }
                ]
            })
            .toArray();

        const transaction = {
            ...transactionResult,
            images : imageResult
        }

        return transaction
    }catch (err) {
        throw new AppError("Failed to get transaction details", 500);
    }
}

export const editTransaction = async (
    userId: string,
    _id: string,
    type: "income" | "expense",
    name: string,
    amount: number,
    category: string,
    description: string,
    date: Date
) => {
    try {
        if(!_id || !userId) throw new AppError("Transaction ID is required", 400);

        const result = await TransactionModel.editTransactionById(
            {
                _id: new ObjectId(_id),
                userId: new ObjectId(userId),
            }, 
            {
                type: type === "expense" ? "expense" : "income",
                name: name,
                amount: amount,
                category: category,
                description: description,
                date: date,
            }
        );

        return result
    } catch (err) {
        throw new AppError("Failed to edit transaction", 500);
    }
};

export const deleteTransaction = async (userId: string, transactionId: string) => {
    try {
        const result = await TransactionModel.deleteTransactionById({
            _id: new ObjectId(transactionId),
            userId: new ObjectId(userId),
        });

        if (result.matchedCount === 0) {
            throw new AppError("Transaction not found", 404);
        }

        return result;
    } catch (err) {
        if (err instanceof AppError) throw err;
        throw new AppError("Failed to delete transaction", 500);
    }
};

export const getTransactionCategories = async () => {
    try {
        const categories = await TransactionCategoryModel.getAll();
        return categories;
    } catch (err) {
        throw new AppError("Failed to fetch transaction categories", 500);
    }
};