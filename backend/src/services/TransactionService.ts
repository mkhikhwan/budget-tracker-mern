import { ObjectId, WithId } from "mongodb"
import { TransactionModel, Transaction } from "../models/Transaction"
import { Image, ImageModel } from "../models/Image";
import AppError from "../utils/AppError";

export const createTransaction = async (
    userId: string,
    type: string,
    name: string,
    amount: number,
    category: string,
    description: string,
    date: string
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

export const getAllTransaction = async (userId: string):Promise<WithId<Transaction>[]> => {
    try{
        const result = await TransactionModel.getAllTransactionsByUserId(userId);
        return result;
    } catch (err) {
        throw new AppError("Failed to fetch transactions", 500);
    }
}

export const getTransactionDetails = async (id: string) => {
    try{
        const transactionResult = await TransactionModel.collection()
            .findOne({ _id: new ObjectId(id) });

        if(!transactionResult === null){
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
    date: string
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