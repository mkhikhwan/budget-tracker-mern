import { apiClient } from "../../shared/api/apiClient";

import {
    type CreateTransactionRequestDto,
    type CreateTransactionResponseDto,
    type EditTransactionRequestDto,
    type GetAllTransactionsResponseDto,
    type GetTransactionDetailsResponseDto,
    type GetTransactionCategoriesResponseDto,
    type DeleteTransactionRequestDto
} from "@budget-now/contract";
import { mapTransactionDetailsToEditDto } from "./Transactions.mapper";
import type { TransactionDetails } from "./Transactions.types";

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

export function deleteImagesFromTransaction(id: string, payload: { ids: string[] }) {
    return apiClient(`/api/transaction/${id}/images`, {
        method: "DELETE",
        body: JSON.stringify(payload)
    });
}

export async function getAllTransaction(page?: number, filters?: Record<string, string | number | undefined>): Promise<GetAllTransactionsResponseDto>{
    const params = new URLSearchParams();

    if (page) params.append("page", page.toString());

    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== "" && value !== null) {
                params.append(key, value.toString());
            }
        });
    }

    const queryString = params.toString();
    return apiClient(`/api/transaction/${queryString ? `?${queryString}` : ""}`, {
        method: "GET"
    });
}

export async function getTransactionDetail(id: string): Promise<GetTransactionDetailsResponseDto>{
    return apiClient(`/api/transaction/${id}`, {
        method: "GET"
    });
}

export async function getTransactionCategories(): Promise<GetTransactionCategoriesResponseDto> {
    return apiClient(`/api/transaction/categories`, {
        method: "GET"
    });
}

export async function editTransaction(transaction: TransactionDetails) {
    const dto:EditTransactionRequestDto = mapTransactionDetailsToEditDto(transaction);

    return apiClient(`/api/transaction/${transaction._id}`, {
        method: "PUT",
        body: JSON.stringify(dto)
    });
}

export async function deleteTransaction(transactionId: string) {
    const payload: DeleteTransactionRequestDto = { transactionId };

    return apiClient(`/api/transaction/delete`, {
        method: "DELETE",
        body: JSON.stringify(payload)
    });
}
