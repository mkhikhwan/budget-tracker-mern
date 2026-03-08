import type { 
    Transaction, 
    TransactionDetails,
    Image,
} from "./Transactions.types";

import type { 
    CreateTransactionRequestDto,
    GetAllTransactionsResponseDto,
    GetTransactionDetailsResponseDto,
} from "@budget-now/contract";

export const mapTransactionToCreateDto = (
    transaction: TransactionDetails
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

export const mapGetAllResponseToTransactions = (
    response: GetAllTransactionsResponseDto
): Transaction[] => {
    return response.transactions.map((dto) => {
        const transaction:Transaction = {
            _id: dto._id,
            type: dto.type,
            name: dto.name,
            amount: dto.amount,
            category: dto.category,
            date: dto.date,
        }

        return transaction
    });
};

export const mapGetDetailsResponseToTransactionDetails = (
    response: GetTransactionDetailsResponseDto
): TransactionDetails => {
    return {
        _id: response._id,
        type: response.type,
        name: response.name,
        amount: response.amount,
        category: response.category,
        date: response.date,
        description: response.description,
        images: response.images?.map((img): Image => ({
            _id: img._id,
            url: img.url,
            isFromDb: true,
        })),
    } as TransactionDetails;
};

