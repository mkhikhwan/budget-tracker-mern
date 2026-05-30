import { type TransactionCategory } from "../../backend/src/models/TransactionCategory";
import { type Transaction } from "../../backend/src/models/Transaction";

export interface TransactionDto extends Omit<Transaction, "_id" | "userId">{
    _id: string;
}

export interface TransactionCategoryDto extends Omit<TransactionCategory, "_id">{
    _id: string;
}

export interface ImageDto{
    _id?: string;
    transactionId: string;
    url: string;
}

export interface CreateTransactionRequestDto extends Omit<TransactionDto, "_id"> {}

export interface CreateTransactionResponseDto {
    transactionId: string
}

export interface GetAllTransactionsResponseDto{
    transactions: Omit<
        TransactionDto, "description"
    >[]
}

export interface GetTransactionDetailsResponseDto{
    _id: string;
    type: string;
    name: string;
    amount: number;
    category: string;
    description: string;
    date: string;
    images: ImageDto[];
}

export interface EditTransactionRequestDto extends TransactionDto{}

export interface GetTransactionCategoriesResponseDto{
    categories: TransactionCategoryDto[];
}

export interface DeleteTransactionRequestDto{
    transactionId: string
}