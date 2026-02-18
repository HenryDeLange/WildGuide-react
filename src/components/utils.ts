
export function uppercaseFirst(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getServerFileUrl(url?: string) {
    if (!url || url.trim().length === 0)
        return undefined;
    const baseUrl = import.meta.env.VITE_API_URL;
    return new URL(url, baseUrl).toString();
}
