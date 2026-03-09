export interface TransactionDto{
    _id?: string;
    type: string;
    name: string;
    amount: number;
    category: string;
    description: string;
    date: string;
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