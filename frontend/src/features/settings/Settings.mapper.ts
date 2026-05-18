import type { GetUserSettingsResponseDto, UpdateUserSettingsRequestDto } from "@budget-now/contract";
import type { UserSettings } from "./Settings.types";

export const mapSettingsToUI = (dto: GetUserSettingsResponseDto): UserSettings => {
    return {
        country: dto.settings.country,
    };
};

export const mapSettingsToPayload = (settings: UserSettings): UpdateUserSettingsRequestDto => {
    return {
        settings: {
            country: settings.country,
        },
    };
};
