import { AppRootState } from '@/redux/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


export type AuthFullState = {
    userId: number | null;
    username: string | null;
    accessToken: string | null;
    refreshToken: string | null;
};

const initialState: AuthFullState = {
    userId: null,
    username: null,
    accessToken: null,
    refreshToken: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authLogin: (state, action: PayloadAction<AuthFullState>) => {
            state.userId = action.payload.userId;
            state.username = action.payload.username;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
        authRefresh: (state, action: PayloadAction<AuthFullState>) => {
            state.userId = action.payload.userId;
            state.username = action.payload.username;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
        authLogout: () => ({ ...initialState }),
        authReplaceAccessToken: (state, action: PayloadAction<string | null>) => {
            state.accessToken = action.payload;
        }
    }
});

export const {
    authLogin,
    authRefresh,
    authLogout,
    authReplaceAccessToken
} = authSlice.actions;

export const selectAuth = (state: AppRootState) => state.auth;
export const selectAuthUserId = (state: AppRootState) => state.auth.userId;
export const selectAuthUsername = (state: AppRootState) => state.auth.username;
export const selectAuthAccessToken = (state: AppRootState) => state.auth.accessToken;
export const selectAuthRefreshToken = (state: AppRootState) => state.auth.refreshToken;

export default authSlice.reducer;
