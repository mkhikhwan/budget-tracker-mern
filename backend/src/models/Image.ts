import { Db, ObjectId } from "mongodb";
import { getDb } from "../config/db";

export interface Image{
    _id?: ObjectId,
    url: string
};

const COLLECTION = "images"

export const ImageModel = {
    collection(){
        return getDb().collection<Image>(COLLECTION);
    }
};


