import { type Transaction } from "./Transactions.types";
import { type CreateTransactionRequestDto } from "@budget-now/contract";

export const mapTransactionToCreateDto = (
    transaction: Transaction
): CreateTransactionRequestDto => {
    return {
        type: transaction.type,
        name: transaction.name,
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description,
        date: transaction.date,
    };
};
