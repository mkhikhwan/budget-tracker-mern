import React, { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { type UserSettings } from "../Settings.types";
import * as SettingsAPI from "../Settings.api"
import * as SettingsMapper from "../Settings.mapper"

interface RESTCountry {
    currencies: {
        [key: string]: {
            name: string;
            symbol: string;
        };
    };
}

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

    useEffect(() => {
        SettingsAPI.getSettings()
            .then(data => {
                setSettings(SettingsMapper.mapSettingsToUI(data));
            });
    }, []);

    useEffect(() => {
        if (!settings?.country) return;

        const fetchCurrency = async () => {
            try {
                const res = await fetch(`https://restcountries.com/v3.1/alpha/${settings.country}?fields=currencies`);
                if (!res.ok) throw new Error("Failed to fetch currency");
                const data: RESTCountry = await res.json();
                const currencyCode = Object.keys(data.currencies)[0];
                const symbol = data.currencies[currencyCode].symbol || data.currencies[currencyCode].name;
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
