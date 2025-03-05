export const REFRESH_TOKEN = 'auth-refresh-token';

export function storeAuthData(key: string, value: string) {
    try {
        localStorage.setItem(key, value);
    }
    catch (e) {
        console.error(e);
    }
};

export function loadAuthData(key: string) {
    try {
        return localStorage.getItem(key);
    }
    catch (e) {
        console.error(e);
    }
};
