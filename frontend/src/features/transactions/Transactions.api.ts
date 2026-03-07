import { apiClient } from "../../shared/api/apiClient";
import { 
    type Transaction, 
    type TransactionDetails
} from "./Transactions.types";

import {
    type CreateTransactionRequestDto,
    type CreateTransactionResponseDto
} from "@budget-now/contract";

export function addTransaction(transaction:CreateTransactionRequestDto): Promise<CreateTransactionResponseDto> {
    return apiClient("/api/transaction/add", {
        method: "POST",
        body: JSON.stringify(transaction)
    });
}

export function addImagesToTransaction(id: string, payload: FormData) {
    return apiClient(`/api/transaction/${id}/images`, {
        method: "POST",
        body: payload
    });
}

export async function getAllTransaction(): Promise<Transaction[]>{
    return apiClient("/api/transaction/", {
        method: "GET"
    });
}

export async function getTransactionDetail(id: string): Promise<TransactionDetails>{
    return apiClient(`/api/transaction/${id}`, {
        method: "GET"
    });
}

export async function editTransaction(id:string, payload:FormData){
    return apiClient(`/api/transaction/${id}`, {
        method: "PUT",
        body: payload
    });
}