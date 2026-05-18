import { apiClient } from "../../shared/api/apiClient";
import type { 
    GetUserSettingsResponseDto, 
    UpdateUserSettingsRequestDto 
} from "@budget-now/contract";

const BASE_PATH = "/api/user";

export const getSettings = (): Promise<GetUserSettingsResponseDto> => {
    return apiClient<GetUserSettingsResponseDto>(`${BASE_PATH}/settings`);
};

export const updateSettings = (data: UpdateUserSettingsRequestDto): Promise<void> => {
    return apiClient<void>(`${BASE_PATH}/settings`, {
        method: "POST",
        body: JSON.stringify(data),
    });
};