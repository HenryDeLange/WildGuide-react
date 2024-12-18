export const REFRESH_TOKEN = 'auth-refresh-token';

export async function saveData(key: string, value: string) {
    try {
        localStorage.setItem(key, value);
    }
    catch (e) {
        console.error(e);
    }
};

export async function loadData(key: string) {
    try {
        return localStorage.getItem(key);
    }
    catch (e) {
        console.error(e);
    }
};
