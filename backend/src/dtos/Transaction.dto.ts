export interface CreateTransactionDto {
    type: string;
    name: string;
    amount: number;
    category: string;
    description: string;
    date: string;
    images?: Express.Multer.File[];
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
    images?: Express.Multer.File[];
    deletedImagesId?: string[];
}