import { AuthFullState } from './authSlice';

export const KEY_USER_ID = 'auth-user-id';
export const KEY_USER_NAME = 'auth-user-name';
export const KEY_ACCESS_TOKEN = 'auth-access-token';
export const KEY_REFRESH_TOKEN = 'auth-refresh-token';

function storeAuthData(key: string, value: string) {
    try {
        localStorage.setItem(key, value);
    }
    catch (e) {
        console.error(e);
    }
}

function loadAuthData(key: string) {
    try {
        return localStorage.getItem(key);
    }
    catch (e) {
        console.error(e);
    }
}

export function storeAllAuthData(value: AuthFullState) {
    storeAuthData(KEY_USER_ID, value.userId?.toString() ?? '');
    storeAuthData(KEY_USER_NAME, value.username ?? '');
    storeAuthData(KEY_ACCESS_TOKEN, value.accessToken ?? '');
    storeAuthData(KEY_REFRESH_TOKEN, value.refreshToken ?? '');
};

export function loadAllAuthData(): AuthFullState {
    const userId = loadAuthData(KEY_USER_ID);
    return {
        userId: userId ? Number(userId) : null,
        username: loadAuthData(KEY_USER_NAME) ?? null,
        accessToken: loadAuthData(KEY_ACCESS_TOKEN) ?? null,
        refreshToken: loadAuthData(KEY_REFRESH_TOKEN) ?? null
    }
};
