
export function uppercaseFirst(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getServerFileUrl(url: string) {
    const baseUrl = import.meta.env.VITE_API_URL;
    console.log(new URL(url, baseUrl).toString())
    return new URL(url, baseUrl).toString();
}
