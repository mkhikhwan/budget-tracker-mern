import { Request, Response } from "express";
import * as TransactionService from "../services/TransactionService"
import { ObjectId } from "mongodb";
import { CreateTransactionDto, EditTransactionDto, GetTransactionDetailsDto } from "../dtos/Transaction.dto";

export const createTransaction = async (req: Request, res:Response) => {
    try{
        const images = req.files as Express.Multer.File[];

        const dto: CreateTransactionDto = {
            ...req.body,
            images
        }

        const result = await TransactionService.createTransaction(dto);

        return res.status(201).json(result);
    }catch(err: unknown){
        return res.status(500).json({message: "Failed to create transaction"})
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

export const getTransactionDetails = async (req: Request, res:Response) => {
    try{
        const id : string | string[] = req.params.id;

        if(!id || Array.isArray(id)){
            return res.status(400).json({ message: "Missing or invalid parameter: id" });
        }else if(!ObjectId.isValid(id)){
            return res.status(400).json({ message: "Invalid id format" });
        }

        const result = await TransactionService.getTransactionDetails(id);

        if (!result) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        const dto: GetTransactionDetailsDto = {
            _id: result._id.toString(),
            type: result.type,
            name: result.name,
            amount: result.amount,
            category: result.category,
            description: result.description,
            date: result.date,
            images: result.images.map((img: any) => ({
                _id: img._id.toString(),
                transactionId: img.transactionId.toString(),
                url: `/uploads/${img.filename}`,
                filename: img.filename,
                isFromDatabase: true
            }))
        };

        return res.status(200).json(dto);
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

        const dto:EditTransactionDto = {
            ...req.body,
            deletedImagesId : normalizedDeletedImagesId,
            images
        }

        const result = await TransactionService.editTransaction(dto);

        return res.status(201).json({message: "Edit successful."});
    }catch(err: unknown){
        return res.status(500).json({message: "Failed to edit transaction"})
    }
}