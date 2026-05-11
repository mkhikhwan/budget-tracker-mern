import { ObjectId, WithId } from "mongodb";
import { getDb } from "../config/db";
import argon2 from "argon2";

export interface Allowance {
    amountLimit: number;
    resetDays: number;
    startDate: Date;
}

export interface User {
    _id?: ObjectId;
    email: string;
    password?: string;

    country: string;
    name: string;

    allowance: Allowance;
    
    providers?: {
        googleId?: string;
        githubId?: string;
    };

    last_login: string;
    is_active: boolean;
    token_version?: number;
}

const COLLECTION = "users";

export const UserModel = {
    collection() {
        return getDb().collection<User>(COLLECTION);
    },

    async prepareUser(data: Partial<User>): Promise<User | undefined> {
        // User cannot register with empty password
        if(!data.password || data.password === "") return

        return {
            _id: new ObjectId(),
            email: data.email!,
            password: await argon2.hash(data.password),
            country: data.country!,
            name: data.name!,
            allowance: data.allowance || {
                amountLimit: 0,
                resetDays: 30,
                startDate: new Date()
            },
            is_active: true,
            last_login: new Date().toISOString()
        }
    },

    async create(user: User){
        return this.collection().insertOne(user);
    },

    async findByEmail(email: string): Promise< WithId<User> | null>{
        return this.collection().findOne({ email });
    },

    async verifyPassword(hashed:string, plain:string): Promise<Boolean>{
        try{
            return await argon2.verify(hashed, plain);
        }catch(e:unknown){
            return false;
        }
    }
};