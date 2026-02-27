import { ObjectId } from "mongodb"
import { TransactionModel, Transaction } from "../models/Transaction"
import { Image, ImageModel } from "../models/Image";

export const createTransaction = async ({type, name, amount, category, description, date, images}:Transaction)=>{
    try{
        const transaction: Transaction = {
            type,
            name,
            amount,
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

        return { transactions : result }
    }catch (err) {
        throw new Error(err instanceof Error ? err.message : String(err));
    }
}