import { ObjectId } from "mongodb"
import { TransactionModel, Transaction } from "../models/Transaction"
import { Image, ImageModel } from "../models/Image";
import { EditTransactionDto } from "../dtos/Transaction.dto";

export const createTransaction = async ({type, name, amount, category, description, date, images}:Transaction)=>{
    try{
        const transaction: Transaction = {
            type: type,
            name: name,
            amount: Number(amount),
            category,
            description,
            date
        };
        const result = await TransactionModel.collection().insertOne(transaction);
        const transactionId = result.insertedId;

        if(images && images.length > 0){
            const imageDocs = images.map<Image>((img)=>{
                const newImg:Image = {
                    transactionId: transactionId,
                    filename: img.filename,
                    path: img.path,
                    mimetype: img.mimetype,
                    size: img.size,
                    uploadedAt: new Date().toISOString()
                }

                return newImg;
            });

            await ImageModel.collection().insertMany(imageDocs);
        }

        return { ...transaction, _id: result.insertedId};
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : String(err));
    }
};

export const getAllTransaction = async () => {
    try{
        const result = await TransactionModel.collection()
            .find({}, { projection: { description: 0 }})
            .toArray();

        return result
    }catch (err) {
        throw new Error(err instanceof Error ? err.message : String(err));
    }
}

export const getTransaction = async (id: string) => {
    try{
        const transactionResult = await TransactionModel.collection()
            .findOne({ _id: new ObjectId(id) });

        if(!transactionResult) return

        const imageResult = await ImageModel.collection()
            .find({ transactionId: new ObjectId(id)})
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

export const editTransaction = async ({id, type, name, amount, category, description, date, images, deletedImagesId}:EditTransactionDto) => {
    try {
        const transaction:Transaction = {
            type: type === "expense" ? "expense" : "income",
            name: name,
            amount: amount,
            category: category,
            description: description,
            date: date,
        }

        await TransactionModel.collection().updateOne(
            { 
                _id: new ObjectId(id) 
            }, 
            {
                $set: transaction
            }
        )

        // Delete images
        if(deletedImagesId){
            const idToDelete = deletedImagesId.map((id:string) => new ObjectId(id));

            await ImageModel.collection().deleteMany({
                _id: {
                    $in: idToDelete
                }
            });
        }

        // Add Images
        if(images && images.length > 0){
            const imageDocs = images.map<Image>((img)=>{
                const newImg:Image = {
                    transactionId: new ObjectId(id),
                    filename: img.filename,
                    path: img.path,
                    mimetype: img.mimetype,
                    size: img.size,
                    uploadedAt: new Date().toISOString()
                }

                return newImg;
            });

            await ImageModel.collection().insertMany(imageDocs);
        }
    } catch (err) {
        console.log(err);
        throw new Error(err instanceof Error ? err.message : String(err));
    }
};