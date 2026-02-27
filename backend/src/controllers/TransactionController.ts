import { Request, Response } from "express";
import * as TransactionService from "../services/TransactionService"

export const createTransaction = async (req: Request, res:Response) => {
    try{
        console.log("req.body: ", req.body);
        console.log("req.files: ", req.files);

        const { type, name, amount, category, description, date } = req.body;

        const images = req.files as Express.Multer.File[];
        console.log(images);

        const result = await TransactionService.createTransaction({
            type,
            name,
            amount,
            category,
            description,
            date,
            images
        })

        res.status(201).json(result);
    }catch(err: unknown){
        res.status(500).json({message: "Failed to create transaction"})
    }
};

export const getAllTransaction = async (req: Request, res:Response) => {
    try{
        const result = await TransactionService.getAllTransaction();

        res.status(200).json(result);
    }catch(err: unknown){
        res.status(500).json({message: "Failed to get all transactions"})
    }
}