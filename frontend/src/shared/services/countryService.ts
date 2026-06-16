export interface Country {
    code: string;
    name: string;
    symbol: string;
}

// TOGGLE THIS FLAG TO SWITCH BETWEEN API AND HARDCODED VALUES
export const USE_HARDCODED = true;

export const HARDCODED_COUNTRIES: Country[] = [
    { code: "MY", name: "Malaysia", symbol: "RM" },
    { code: "US", name: "United States", symbol: "$" },
    { code: "GB", name: "United Kingdom", symbol: "£" },
    { code: "DE", name: "Germany", symbol: "€" },
    { code: "JP", name: "Japan", symbol: "¥" },
    { code: "SG", name: "Singapore", symbol: "S$" },
    { code: "AU", name: "Australia", symbol: "A$" },
    { code: "CA", name: "Canada", symbol: "C$" },
    { code: "CN", name: "China", symbol: "¥" },
    { code: "IN", name: "India", symbol: "₹" }
];

// Cache for API responses
let cachedCountryList: Country[] | null = null;

interface APICountryResponse {
    codes?: {
        alpha_2?: string;
    };
    names?: {
        common?: string;
    };
    currencies?: {
        code?: string;
        name?: string;
        symbol?: string;
    }[];
}

export async function getCountries(): Promise<Country[]> {
    if (USE_HARDCODED) {
        return HARDCODED_COUNTRIES;
    }

    if (cachedCountryList) {
        return cachedCountryList;
    }

    try {
        const res = await fetch("https://api.restcountries.com/countries/v5?response_fields=names,codes,currencies&limit=300", {
            headers: {
                "Authorization": `Bearer ${import.meta.env.RESTCOUNTRY_API_KEY}`
            }
        });
        if (!res.ok) throw new Error("Failed to fetch country list from API");
        const root = await res.json();
        const data: APICountryResponse[] = root.data?.objects || [];
        
        const apiList = data.map((c: APICountryResponse) => {
            const firstCurrency = c.currencies?.[0];
            return {
                code: c.codes?.alpha_2 || "",
                name: c.names?.common || "",
                symbol: firstCurrency?.symbol || firstCurrency?.name || "$"
            };
        }).filter((c: Country) => c.code && c.name);

        apiList.sort((a: Country, b: Country) => a.name.localeCompare(b.name));
        cachedCountryList = apiList;
        return apiList;
    } catch (error) {
        console.error("Error fetching country list from API, falling back to hardcoded data:", error);
        return HARDCODED_COUNTRIES;
    }
}

export async function getCurrencySymbol(countryCode: string): Promise<string> {
    const codeUpper = countryCode.toUpperCase();

    if (USE_HARDCODED) {
        const country = HARDCODED_COUNTRIES.find(c => c.code === codeUpper);
        return country ? country.symbol : "$";
    }

    try {
        const res = await fetch(`https://api.restcountries.com/countries/v5/codes.alpha_2/${codeUpper}?response_fields=currencies`, {
            headers: {
                "Authorization": `Bearer ${import.meta.env.RESTCOUNTRY_API_KEY}`
            }
        });
        if (!res.ok) throw new Error("Failed to fetch currency from API");
        const root = await res.json();
        const objects = root.data?.objects || [];
        if (objects.length > 0 && objects[0].currencies && objects[0].currencies.length > 0) {
            const firstCurrency = objects[0].currencies[0];
            return firstCurrency.symbol || firstCurrency.name || "$";
        }
        return "$";
    } catch (error) {
        console.error("Error fetching currency from API, falling back to hardcoded data:", error);
        const country = HARDCODED_COUNTRIES.find(c => c.code === codeUpper);
        return country ? country.symbol : "$";
    }
}
