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
    images?: ImageDatabase[];
}

export interface Image{
    id: string,
    url: string,
    file?: File
};

export interface ImageDatabase{
    _id: string;
    transactionId: string;
    filename: string;
    path: string;
    mimetype: string;
    size: number;
    uploadedAt: string;
}