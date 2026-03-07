export interface CreateTransactionRequestDto {
    type: string;
    name: string;
    amount: number;
    category: string;
    description: string;
    date: string;
    images?: any;
}

export interface CreateTransactionResponseDto {
    transactionId: string
}

export interface GetTransactionDetailsDto{
    _id: string;
    type: string;
    name: string;
    amount: number;
    category: string;
    description: string;
    date: string;
    images: Array<{
        _id: string;
        transactionId: string;
        url: string;
        filename: string;
        isFromDatabase: Boolean;
    }>;
}

export interface EditTransactionDto {
    id: string;
    type: string;
    name: string;
    amount: number;
    category: string;
    description: string;
    date: string;
    images?: any;
    deletedImagesId?: string[];
}