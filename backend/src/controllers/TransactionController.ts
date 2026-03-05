import { Request, Response } from "express";
import * as TransactionService from "../services/TransactionService"
import { ObjectId } from "mongodb";

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

export const getTransaction = async (req: Request, res:Response) => {
    try{
        const id : string | string[] = req.params.id;

        if(!id || Array.isArray(id)){
            return res.status(400).json({ message: "Missing or invalid parameter: id" });
        }else if(!ObjectId.isValid(id)){
            return res.status(400).json({ message: "Invalid id format" });
        }

        const result = await TransactionService.getTransaction(id as string);
        if(!result){
            return res.status(404).json({ message: "Transaction not found" });
        }

        return res.status(200).json(result);
    }catch(err: unknown){
        return res.status(500).json({message: "Failed to get transaction details."})
    }
}

export const editTransaction = async (req: Request, res: Response) => {
    try{
        const images = req.files as Express.Multer.File[];

        const {deletedImagesId} = req.body;

        const normalizedDeletedImagesId: String[] = 
            Array.isArray(deletedImagesId) ? deletedImagesId : (deletedImagesId ? [deletedImagesId] : [])

        const result = await TransactionService.editTransaction({
            ...req.body,
            deletedImagesId : normalizedDeletedImagesId,
            images
        });

        return res.status(201).json({message: "Edit successful."});
    }catch(err: unknown){
        return res.status(500).json({message: "Failed to edit transaction"})
    }
}