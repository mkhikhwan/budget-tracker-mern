import { ObjectId } from "mongodb";
import { getDb } from "../config/db";

export interface Image {
    _id?: ObjectId;
    transactionId: ObjectId;
    filename: string;
    path: string;
    mimetype: string;
    size: number;
    uploadedAt: string;
}

const COLLECTION = "images"

export const ImageModel = {
    collection(){
        return getDb().collection<Image>(COLLECTION);
    }
};
