import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

export const tagTypes = [
    'Users',
    'Taxa',
    'Projects'
] as const;

export const inatApi = createApi({
    reducerPath: 'inatApi',
    tagTypes,
    baseQuery:
        retry(
            fetchBaseQuery({ baseUrl: 'https://api.inaturalist.org/v1/' }),
            {
                maxRetries: 1
            }
        ),
    endpoints: (builder) => ({
        usersAutocomplete: builder.query<UserAutocomplete, UserAutocompleteArgs>({
            query: (queryArg) => ({
                url: 'users/autocomplete',
                params: {
                    q: queryArg.q,
                    per_page: queryArg.per_page
                }
            }),
            providesTags: ['Users']
        }),
        taxaAutocomplete: builder.query<TaxaAutocomplete, TaxaAutocompleteArgs>({
            query: (queryArg) => ({
                url: 'taxa/autocomplete',
                params: {
                    q: queryArg.q,
                    per_page: queryArg.per_page
                }
            }),
            providesTags: ['Taxa']
        }),
        projectsAutocomplete: builder.query<ProjectsAutocomplete, ProjectsAutocompleteArgs>({
            query: (queryArg) => ({
                url: 'projects/autocomplete',
                params: {
                    q: queryArg.q,
                    per_page: queryArg.per_page
                }
            }),
            providesTags: ['Projects']
        })
    }),
    keepUnusedDataFor: 180
});

export const {
    useUsersAutocompleteQuery,
    useTaxaAutocompleteQuery
} = inatApi;

export type UserAutocompleteArgs = {
    q: string;
    per_page?: number;
};

export type UserAutocomplete = {
    total_results: number;
    page: number; // Starts at 1
    per_page: number;
    results: User[];
};

export type User = {
    id: number;
    login: string;
    name: string;
    icon: string;
    observations_count: number;
    identifications_count: number;
    journal_posts_count: number;
    activity_count: number;
    species_count: number;
};

export type TaxaAutocompleteArgs = {
    q: string;
    is_active?: boolean;
    taxon_id?: string[];
    rank?: string[];
    rank_level?: number;
    per_page?: number;
    locale?: string;
    preferred_place_id?: number;
    all_names?: boolean;
};

export type TaxaAutocomplete = {
    total_results: number;
    page: number; // Starts at 1
    per_page: number;
    results: Taxon[];
};

export type Taxon = {
    id: number;
    is_active: boolean;
    name: string;
    preferred_common_name: string;
    rank: string;
    rank_level: number;
    parent_id: number;
    ancestor_ids: number[];
    default_photo?: {
        id: number;
        attribution: string;
        license_code: string;
        url: string;
        medium_url: string;
        square_url: string
    };
    wikipedia_url?: string;
    observations_count: number;
    extinct?: boolean;
    conservation_status?: {
        authority?: string;
        status?: string;
        status_name?: string;
        geoprivacy?: string;
        iucn?: number;
    }
};

export type ProjectsAutocompleteArgs = {
    q: string;
    id?: number[];
    lat?: number;
    lng?: number;
    radius?: number; // km
    place_id?: number[];
    rule_details?: boolean;
    type?: 'collection' | 'umbrella' | 'bioblitz' | 'traditional'; // TODO: Confirm these???
    member_id?: number;
    per_page?: number;
};

export type ProjectsAutocomplete = {
    total_results: number;
    page: number; // Starts at 1
    per_page: number;
    results: Project[];
};

export type Project = {
    id: number;
    title: string;
    description: string;
    slug: string;
    project_type: 'collection' | 'umbrella' | 'bioblitz' | 'traditional'; // TODO: Confirm these???
    banner_color: string;
    icon: string;
    header_image_url: string;
}
