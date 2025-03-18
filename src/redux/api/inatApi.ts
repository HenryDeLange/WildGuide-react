import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

export const tagTypes = [
    'Users',
    'Projects',
    'Taxa',
    'Observations',
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
                params: { ...queryArg }
            }),
            providesTags: ['Users']
        }),
        projectsAutocomplete: builder.query<ProjectsAutocomplete, ProjectsAutocompleteArgs>({
            query: (queryArg) => ({
                url: 'projects/autocomplete',
                params: { ...queryArg }
            }),
            providesTags: ['Projects']
        }),
        projectFind: builder.query<ProjectFind, ProjectFindArgs>({
            query: (queryArg) => ({
                url: `projects/${queryArg.id}`,
            }),
            providesTags: ['Projects']
        }),
        taxaAutocomplete: builder.query<TaxaAutocomplete, TaxaAutocompleteArgs>({
            query: (queryArg) => ({
                url: 'taxa/autocomplete',
                params: { ...queryArg }
            }),
            providesTags: ['Taxa']
        }),
        taxaFind: builder.query<TaxaFind, TaxaFindArgs>({
            query: (queryArg) => ({
                url: 'taxa',
                params: { ...queryArg }
            }),
            providesTags: ['Taxa']
        }),
        taxonFind: builder.query<TaxonFind, TaxonFindArgs>({
            query: (queryArg) => ({
                url: `taxa/${queryArg.id}`,
            }),
            providesTags: ['Taxa']
        }),
        observationFind: builder.query<ObservationFind, ObservationFindArgs>({
            query: (queryArg) => ({
                url: `observations/${queryArg.id}`,
            }),
            providesTags: ['Observations']
        }),
        observationsFind: builder.query<ObservationsFind, ObservationsFindArgs>({
            query: (queryArg) => ({
                url: 'observations',
                params: { ...queryArg }
            }),
            providesTags: ['Observations']
        }),
        speciesCountsFind: builder.query<SpeciesCountFind, SpeciesCountFindArgs>({
            query: (queryArg) => ({
                url: 'observations/species_counts',
                params: { ...queryArg }
            }),
            providesTags: ['Observations']
        })
    }),
    keepUnusedDataFor: 300 // 5 minutes
});

export const {
    useUsersAutocompleteQuery,
    useProjectsAutocompleteQuery,
    useProjectFindQuery,
    useTaxaAutocompleteQuery,
    useTaxaFindQuery,
    useTaxonFindQuery,
    useObservationFindQuery,
    useObservationsFindQuery,
    useSpeciesCountsFindQuery
} = inatApi;

type ResponseBase = {
    total_results: number;
    /** Starts at 1 */
    page: number;
    per_page: number;
}

export type UserAutocompleteArgs = {
    q: string;
    per_page?: number;
};

export type UserAutocomplete = ResponseBase & {
    results: User[];
};

export type User = {
    id: number;
    login: string;
    name: string;
    icon: string;
    icon_url: string;
    created_at: string;
    observations_count: number;
    identifications_count: number;
    journal_posts_count: number;
    species_count: number;
    activity_count: number;
    universal_search_rank: number;
};

export type TaxaAutocompleteArgs = {
    q: string;
    is_active?: boolean;
    /** NOTE: iNat returns all taxa with these ids as ancestor, unfortunately there doesn't seem to be a way to only return the requested ids... */
    taxon_id?: number[]; // string[] on the API docs
    rank?: ('kingdom' | 'phylum' | 'class' | 'order' | 'family' | 'subfamily' | 'tribe' | 'subtribe' | 'genus' | 'subgenus' | 'species' | 'subspecies' | 'variety' | 'form')[]; // TODO: Confirm these???
    rank_level?: number;
    locale?: string;
    preferred_place_id?: number;
    all_names?: boolean;
    /** NOTE: Unfortunately it seems pagination is not supported for these endpoints. Limit to 30 for autocomplete, and 200 (or 500?) for find. */
    per_page: number;
};

export type TaxaAutocomplete = ResponseBase & {
    results: Taxon[];
};

export type Taxon = {
    id: number;
    is_active: boolean;
    name: string;
    preferred_common_name: string;
    rank: 'kingdom' | 'phylum' | 'class' | 'order' | 'family' | 'subfamily' | 'tribe' | 'subtribe' | 'genus' | 'subgenus' | 'species' | 'subspecies' | 'variety' | 'form'; // TODO: Confirm these???
    rank_level: number;
    parent_id: number;
    ancestor_ids: number[];
    default_photo?: Photo;
    wikipedia_url?: string;
    wikipedia_summary?: string;
    observations_count: number;
    extinct?: boolean;
    native: boolean;
    introduced: boolean;
    endemic: boolean;
    conservation_status?: {
        authority?: string;
        status?: string;
        status_name?: string;
        geoprivacy?: string;
        iucn?: number;
    };
    taxon_photos?: {
        taxon_id: number;
        photo: Photo;
    }[];
};

export type TaxaFindArgs = Partial<TaxaAutocompleteArgs> & {
    parent_id?: number;
};

export type TaxaFind = TaxaAutocomplete;

export type TaxonFindArgs = {
    id: number;
};

export type TaxonFind = ResponseBase & {
    results: Taxon[];
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
    per_page: number;
};

export type ProjectsAutocomplete = ResponseBase & {
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
    terms?: string;
};

export type ProjectFindArgs = {
    id: number
};

export type ProjectFind = ResponseBase & {
    results: Project[];
};

export type ObservationFindArgs = {
    id: number;
};

export type ObservationFind = ResponseBase & {
    results: Observation[];
};

export type Observation = {
    id: number;
    created_at: string;
    time_observed_at: string;
    observed_on_string: string;
    quality_grade: 'casual' | 'needs_id' | 'research' | 'verifiable'; // TODO: Confirm these???
    license_code: string;
    description: string | null;
    photos: Photo[];
    identifications_count: number;
    species_guess: string;
    mappable: boolean;
    place_guess: string;
    taxon_geoprivacy: 'open' | 'obscured' | 'private'; // TODO: Confirm these???
    obscured: boolean;
    positional_accuracy: number | null;
    geojson: {
        type: 'Point';
        coordinates: [number, number];
    }
    location: string;
    user: User;
    taxon: Taxon;
    // identifications: Identification[];
    captive: boolean;
    comments_count: number;
    // comments: Comment[];
    // annotations: Annotation[];
    faves_count: number;
};

export type ObservationsFindArgs = {
    id?: number[];
    q?: string;
    not_id?: number[];
    taxon_id?: number[]; // Also includes children of the specified taxa
    without_taxon_id?: number[]; // Also excludes children of the specified taxa
    taxon_name?: string[];
    place_id?: number[];
    project_id?: number[];
    quality_grade?: 'casual' | 'needs_id' | 'research';
    d1?: Date;
    d2?: Date;
    updated_since?: Date;
    photos?: boolean;
    threatened?: boolean;
    introduced?: boolean;
    captive?: boolean;
    endemic?: boolean;
    native?: boolean;
    out_of_range?: boolean;
    rank?: ('kingdom' | 'phylum' | 'class' | 'order' | 'family' | 'subfamily' | 'tribe' | 'subtribe' | 'genus' | 'subgenus' | 'species' | 'subspecies' | 'variety' | 'form')[]; // TODO: Confirm these???
    hrank?: 'kingdom' | 'phylum' | 'class' | 'order' | 'family' | 'subfamily' | 'tribe' | 'subtribe' | 'genus' | 'subgenus' | 'species' | 'subspecies' | 'variety' | 'form'; // TODO: Confirm these???
    lrank?: 'kingdom' | 'phylum' | 'class' | 'order' | 'family' | 'subfamily' | 'tribe' | 'subtribe' | 'genus' | 'subgenus' | 'species' | 'subspecies' | 'variety' | 'form'; // TODO: Confirm these???
    term_id?: number[];
    term_value_id?: number[];
    acc_below?: number; // meters
    obscuration?: 'obscured' | 'private' | 'none';
    lat?: number;
    lng?: number;
    radius?: number; // kilometer
    nelat?: number;
    nelng?: number;
    swlat?: number;
    swlng?: number;
    locale?: string;
    preferred_place_id?: number;
    page?: number;
    per_page?: number;
    order?: 'desc' | 'asc';
    order_by?: 'created_at' | 'observed_on' | 'updated_at' | 'geo_score' | 'id' | 'random' | 'species_guess' | 'votes';
};

export type ObservationsFind = ObservationFind;

export type SpeciesCountFind = ResponseBase & {
    results: SpeciesCount[];
};

export type SpeciesCountFindArgs = ObservationsFindArgs;

export type SpeciesCount = {
    count: number;
    observations_count: number;
    taxon: Taxon;
    preferred_establishment_means: string;
}

export type Photo = {
    id: number;
    license_code: string;
    url?: string;
    square_url?: string;
    medium_url?: string;
    large_url?: string;
    original_url?: string;
    attribution?: string;
    original_dimensions?: {
        width: number;
        height: number;
    };
};
