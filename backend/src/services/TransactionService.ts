import { ObjectId, WithId } from "mongodb"
import { TransactionModel, Transaction } from "../models/Transaction"
import { Image, ImageModel } from "../models/Image";

export const createTransaction = async (
    type: string,
    name: string,
    amount: number,
    category: string,
    description: string,
    date: string
)=>{
    try{
        const transaction: Transaction = {
            type: type === "expense" ? "expense" : "income",
            name: name,
            amount: Number(amount),
            category,
            description,
            date
        };
        
        const result = await TransactionModel.collection().insertOne(transaction);
        const transactionId = result.insertedId.toString();

        return { transactionId: transactionId };
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : String(err));
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

export const getAllTransaction = async ():Promise<WithId<Transaction>[]> => {
    try{
        const result = await TransactionModel.collection()
            .find({}, { projection: { description: 0 }})
            .toArray();

        return result
    }catch (err) {
        throw new Error(err instanceof Error ? err.message : String(err));
    }
}

export const getTransactionDetails = async (id: string) => {
    try{
        const transactionResult = await TransactionModel.collection()
            .findOne({ _id: new ObjectId(id) });

        if(!transactionResult) return

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
        throw new Error(err instanceof Error ? err.message : String(err));
    }
}

export const editTransaction = async (
    _id: string,
    type: "income" | "expense",
    name: string,
    amount: number,
    category: string,
    description: string,
    date: string
) => {
    try {
        if(!_id) return;

        const setTransactionDetails:Transaction = {
            type: type === "expense" ? "expense" : "income",
            name: name,
            amount: amount,
            category: category,
            description: description,
            date: date,
        }

        return await TransactionModel.collection().updateOne(
            { 
                _id: new ObjectId(_id) 
            }, 
            {
                $set: setTransactionDetails as any
            }
        )
    } catch (err) {
        console.log(err);
        throw new Error(err instanceof Error ? err.message : String(err));
    }
};