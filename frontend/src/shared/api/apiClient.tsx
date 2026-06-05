const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function apiClient<T>(
    path: string,
    options: RequestInit = {}
): Promise<T>{
    const isFormData = options.body instanceof FormData;

    const res = await fetch(`${BASE_URL}${path}`, {
        headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...options.headers
        },
        credentials: "include",
        ...options,
    });

    if(!res.ok){
        let errorMessage = `Error: ${res.status}`;
        try {
            const errorData = await res.json();
            errorMessage = errorData.message || errorMessage;
        } catch {
            throw new Error(`There's something wrong. Please contact for support.`);
        }
        throw new Error(errorMessage);
    }

    return res.json();
}
