export interface CreateTransactionDto {
    type: string;
    name: string;
    amount: number;
    category: string;
    description: string;
    date: string;
    images?: Express.Multer.File[];
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