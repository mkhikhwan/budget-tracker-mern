import { ObjectId } from "mongodb";
import { getDb } from "../config/db";

export interface User {
    _id?: ObjectId;
    email: string;
    password?: string;

    country: string;
    name: string;
    
    // OAuth specific fields
    providers: {
        googleId?: string;
        githubId?: string;
    };

    last_login: string;
    is_active: boolean;
    token_version: number;
}

const COLLECTION = "users";

export const UserModel = {
    collection() {
        return getDb().collection<User>(COLLECTION);
    }
};