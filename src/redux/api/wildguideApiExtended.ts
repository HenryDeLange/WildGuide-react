import { DownloadIconApiArg, wildguideApi } from './wildguideApi';

export const wildguideApiExtended = wildguideApi.injectEndpoints({
    endpoints: (build) => ({
        downloadIconBlob: build.query<string, DownloadIconApiArg>({
            query: ({ iconCategory, iconCategoryId }) => ({
                url: `/api/v1/icons/${iconCategory}/${iconCategoryId}`,
                // Tell RTK Query to treat the response as a Blob (not JSON)
                responseHandler: async (response: Response) => await response.blob()
            }),
            providesTags: ['Icons'],
            // Don't return the Blob directly, return the object URL instead
            transformResponse: (blob: Blob) => URL.createObjectURL(blob)
        })
    }),
    overrideExisting: false
});

export const {
    useDownloadIconBlobQuery
} = wildguideApiExtended;
