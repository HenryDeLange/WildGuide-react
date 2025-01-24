import { Dispatch, MiddlewareAPI, UnknownAction } from '@reduxjs/toolkit';
import { inatApi } from './inatApi';

const REQUEST_LIMIT = 75; // 100 max
const TIME_WINDOW = 60 * 1000; // 1 minute (in milliseconds)

let requestCount = 0;

export const inatRateLimitMiddleware = (api: MiddlewareAPI) => (next: Dispatch<UnknownAction>) => async (action: UnknownAction) => {
    if (action.type.startsWith(inatApi.reducerPath)) {
        requestCount++;
        if (requestCount > REQUEST_LIMIT) {
            console.warn('iNaturalist rate limit exceeded, delaying request...', action);
            return new Promise((resolve) => {
                setTimeout(() => {
                    requestCount--;
                    resolve(next(action));
                }, TIME_WINDOW);
            });
        }
    }
    return next(action);
};
