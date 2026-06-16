import React, { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { type UserSettings } from "../Settings.types";
import * as SettingsAPI from "../Settings.api"
import * as SettingsMapper from "../Settings.mapper"
import { useAuth } from "../../auth/providers/AuthProvider";

import { getCurrencySymbol } from "../../../shared/services/countryService";

interface SettingsContextType {
    settings: UserSettings | undefined;
    setSettings: React.Dispatch<React.SetStateAction<UserSettings | undefined>>;
    getCurrency: () => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<UserSettings>();
    const [currencySymbol, setCurrencySymbol] = useState("$");
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            setSettings(undefined);
            return;
        }

        SettingsAPI.getSettings()
            .then(data => {
                setSettings(SettingsMapper.mapSettingsToUI(data));
            })
            .catch(error => {
                console.error("Error fetching settings:", error);
                setSettings(undefined);
            });
    }, [user]);

    useEffect(() => {
        if (!settings?.country) {
            setCurrencySymbol("$");
            return;
        }

        const fetchCurrency = async () => {
            try {
                const symbol = await getCurrencySymbol(settings.country);
                setCurrencySymbol(symbol);
            } catch (error) {
                console.error("Error fetching currency:", error);
                setCurrencySymbol("$");
            }
        };

        fetchCurrency();
    }, [settings]);

    const getCurrency = useCallback(() => currencySymbol, [currencySymbol]);

    return (
        <SettingsContext.Provider value={{ settings, setSettings, getCurrency }}>
            {children}
        </SettingsContext.Provider>
    )
}

