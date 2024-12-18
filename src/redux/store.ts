import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '../auth/authSlice';
import { inatApi } from './api/inatApi';
import { wildguideApi } from './api/wildguideApi';

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

// // Special middleware to persist the theme mode (light/dark) to LocalStorage
// const listenerMiddleware = createListenerMiddleware();
// listenerMiddleware.startListening({
//     matcher: isAnyOf(setThemeMode, setZoom),
//     effect: (action, listenerApi) => {
//         switch (action.type) {
//             case 'ui/setThemeMode':
//                 saveUITheme((listenerApi.getState() as RootState).ui.themeMode);
//                 break;
//             case 'ui/setZoom':
//                 saveUIZoom((listenerApi.getState() as RootState).ui.zoom);
//                 break;
//         }
//     }
// });

export const store = configureStore({
    // preloadedState: {
    //     ui: {
    //         themeMode: loadUITheme(),
    //         zoom: loadUIZoom()
    //     }
    // },
    reducer: {
        // ui: themeReducer,
        auth: authReducer,
        [inatApi.reducerPath]: inatApi.reducer,
        wildguideApi: wildguideApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
        // listenerMiddleware.middleware,
        inatApi.middleware,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        wildguideApi.middleware as any,
        // rtkQueryErrorLogger
    )
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type AppRootState = ReturnType<typeof store.getState>;
