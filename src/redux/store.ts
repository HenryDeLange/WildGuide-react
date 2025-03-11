import { loadAllAuthData, storeAllAuthData } from '@/auth/authStorage';
import { configureStore, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer, { authLogin, authLogout, authRefresh } from '../auth/authSlice';
import { inatApi } from './api/inatApi';
import { wildguideApi, addTagTypes as wildGuideApiTags } from './api/wildguideApi';

const listenerMiddleware = createListenerMiddleware();
listenerMiddleware.startListening({
    matcher: isAnyOf(authLogin, authRefresh, authLogout),
    effect: (action, listenerApi) => {
        switch (action.type) {
            case 'auth/authLogin':
                storeAllAuthData((listenerApi.getState() as AppRootState).auth);
                store.dispatch(wildguideApi.util.invalidateTags([...wildGuideApiTags]));
                break;
            case 'auth/authRefresh':
                storeAllAuthData((listenerApi.getState() as AppRootState).auth);
                break;
            case 'auth/authLogout':
                storeAllAuthData({ userId: null, username: null, accessToken: null, refreshToken: null });
                store.dispatch(wildguideApi.util.invalidateTags([...wildGuideApiTags]));
                break;
        }
    }
});

export const store = configureStore({
    preloadedState: {
        auth: loadAllAuthData()
    },
    reducer: {
        auth: authReducer,
        [inatApi.reducerPath]: inatApi.reducer,
        wildguideApi: wildguideApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
        listenerMiddleware.middleware,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        wildguideApi.middleware as any,
        inatApi.middleware
        // rtkQueryErrorLogger
    )
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type AppRootState = ReturnType<typeof store.getState>;

// export const rtkQueryErrorLogger: Middleware = (api: MiddlewareAPI) => (next) => (action) => {
//     if (isRejectedWithValue(action)) {
//         const rejectedAction = action;
//         console.error('ERROR ACTION:', rejectedAction);
//         api.dispatch(addError({
//             type: rejectedAction.type,
//             error: {
//                 message: rejectedAction.error.message ?? 'unknown'
//             },
//             meta: {
//                 requestStatus: rejectedAction.meta.requestStatus ?? 'unknown',
//                 arg: {
//                     endpointName: (rejectedAction.meta.arg as any).endpointName ?? 'unknown',
//                     type: (rejectedAction.meta.arg as any).type ?? 'unknown'
//                 },
//                 baseQueryMeta: {
//                     request: {
//                         method: (rejectedAction.meta as any).baseQueryMeta?.request?.method ?? 'unknown',
//                         url: (rejectedAction.meta as any).baseQueryMeta?.request?.url ?? 'unknown'
//                     }
//                 }
//             },
//             payload: {
//                 status: (rejectedAction.payload as any).status ?? 'unknown',
//                 error: (rejectedAction.payload as any).error ?? undefined, // From FE
//                 data: (rejectedAction.payload as any).data ?? undefined // From BE
//             }
//         }));
//     }
//     return next(action);
// }
