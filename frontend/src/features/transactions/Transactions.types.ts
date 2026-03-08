export interface Transaction{
    _id?: string
    name: string
    type: string
    category: string
    date: string
    amount: number
}

export interface TransactionDetails extends Transaction{
    description: string;
    images?: Image[];
}

export interface Image {
    _id?: string;
    transactionId?: string;
    url: string;
    isFromDb: boolean;
    isDeleted?: boolean;
    file?: File;
}