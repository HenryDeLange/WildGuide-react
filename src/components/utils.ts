import { DownloadIconApiArg } from '@/redux/api/wildguideApi';

export function uppercaseFirst(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getServerFileUrl(url?: string) {
    if (!url || url.trim().length === 0)
        return undefined;
    const baseUrl = import.meta.env.VITE_API_URL;
    return new URL(url, baseUrl).toString();
}

export function getServerIconUrl(iconCategory: DownloadIconApiArg['iconCategory'], iconCategoryId: DownloadIconApiArg['iconCategoryId']) {
    const baseUrl = import.meta.env.VITE_API_URL;
    return new URL(`/api/v1/icons/${iconCategory}/${iconCategoryId}`, baseUrl).toString();
}
