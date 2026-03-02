const BASE_URL = "http://localhost:5000" //TODO: use environtmnet variable

export async function apiClient<T>(
    path: string,
    options: RequestInit = {}
): Promise<T>{
    // TODO: Remove artificial delay of 1 second
    await new Promise(resolve => setTimeout(resolve, 1000));

    const isFormData = options.body instanceof FormData;

    const res = await fetch(`${BASE_URL}${path}`, {
        headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...options.headers
        },
        ...options,
    });

    if(!res.ok){
        throw new Error(`API Error: ${res.status}`);
    }

    return res.json();
}
