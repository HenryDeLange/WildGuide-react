import { wildguideBaseApi as api } from "./wildguideBaseApi";
export const addTagTypes = [
  "Guides",
  "Entries",
  "User Authentication",
  "WildGuide Version",
] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      findGuide: build.query<FindGuideApiResponse, FindGuideApiArg>({
        query: (queryArg) => ({ url: `/guides/${queryArg.guideId}` }),
        providesTags: ["Guides"],
      }),
      updateGuide: build.mutation<UpdateGuideApiResponse, UpdateGuideApiArg>({
        query: (queryArg) => ({
          url: `/guides/${queryArg.guideId}`,
          method: "PUT",
          body: queryArg.guideBase,
        }),
        invalidatesTags: ["Guides"],
      }),
      deleteGuide: build.mutation<DeleteGuideApiResponse, DeleteGuideApiArg>({
        query: (queryArg) => ({
          url: `/guides/${queryArg.guideId}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Guides"],
      }),
      findEntry: build.query<FindEntryApiResponse, FindEntryApiArg>({
        query: (queryArg) => ({
          url: `/guides/${queryArg.guideId}/entries/${queryArg.entryId}`,
        }),
        providesTags: ["Entries"],
      }),
      updateEntry: build.mutation<UpdateEntryApiResponse, UpdateEntryApiArg>({
        query: (queryArg) => ({
          url: `/guides/${queryArg.guideId}/entries/${queryArg.entryId}`,
          method: "PUT",
          body: queryArg.entryBase,
        }),
        invalidatesTags: ["Entries"],
      }),
      deleteEntry: build.mutation<DeleteEntryApiResponse, DeleteEntryApiArg>({
        query: (queryArg) => ({
          url: `/guides/${queryArg.guideId}/entries/${queryArg.entryId}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Entries"],
      }),
      register: build.mutation<RegisterApiResponse, RegisterApiArg>({
        query: (queryArg) => ({
          url: `/users/register`,
          method: "POST",
          body: queryArg.user,
        }),
        invalidatesTags: ["User Authentication"],
      }),
      refresh: build.mutation<RefreshApiResponse, RefreshApiArg>({
        query: () => ({ url: `/users/refresh`, method: "POST" }),
        invalidatesTags: ["User Authentication"],
      }),
      login: build.mutation<LoginApiResponse, LoginApiArg>({
        query: (queryArg) => ({
          url: `/users/login`,
          method: "POST",
          body: queryArg.userLogin,
        }),
        invalidatesTags: ["User Authentication"],
      }),
      findGuides: build.query<FindGuidesApiResponse, FindGuidesApiArg>({
        query: (queryArg) => ({
          url: `/guides`,
          params: {
            page: queryArg.page,
          },
        }),
        providesTags: ["Guides"],
      }),
      createGuide: build.mutation<CreateGuideApiResponse, CreateGuideApiArg>({
        query: (queryArg) => ({
          url: `/guides`,
          method: "POST",
          body: queryArg.guideBase,
        }),
        invalidatesTags: ["Guides"],
      }),
      ownerJoinGuide: build.mutation<
        OwnerJoinGuideApiResponse,
        OwnerJoinGuideApiArg
      >({
        query: (queryArg) => ({
          url: `/guides/${queryArg.guideId}/owners/${queryArg.ownerId}`,
          method: "POST",
        }),
        invalidatesTags: ["Guides"],
      }),
      ownerLeaveGuide: build.mutation<
        OwnerLeaveGuideApiResponse,
        OwnerLeaveGuideApiArg
      >({
        query: (queryArg) => ({
          url: `/guides/${queryArg.guideId}/owners/${queryArg.ownerId}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Guides"],
      }),
      memberJoinGuide: build.mutation<
        MemberJoinGuideApiResponse,
        MemberJoinGuideApiArg
      >({
        query: (queryArg) => ({
          url: `/guides/${queryArg.guideId}/members/${queryArg.memberId}`,
          method: "POST",
        }),
        invalidatesTags: ["Guides"],
      }),
      memberLeaveGuide: build.mutation<
        MemberLeaveGuideApiResponse,
        MemberLeaveGuideApiArg
      >({
        query: (queryArg) => ({
          url: `/guides/${queryArg.guideId}/members/${queryArg.memberId}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Guides"],
      }),
      findEntries: build.query<FindEntriesApiResponse, FindEntriesApiArg>({
        query: (queryArg) => ({
          url: `/guides/${queryArg.guideId}/entries`,
          params: {
            page: queryArg.page,
          },
        }),
        providesTags: ["Entries"],
      }),
      createEntry: build.mutation<CreateEntryApiResponse, CreateEntryApiArg>({
        query: (queryArg) => ({
          url: `/guides/${queryArg.guideId}/entries`,
          method: "POST",
          body: queryArg.entryBase,
        }),
        invalidatesTags: ["Entries"],
      }),
      getVersion: build.query<GetVersionApiResponse, GetVersionApiArg>({
        query: () => ({ url: `/version` }),
        providesTags: ["WildGuide Version"],
      }),
      findGuideOwners: build.query<
        FindGuideOwnersApiResponse,
        FindGuideOwnersApiArg
      >({
        query: (queryArg) => ({ url: `/guides/${queryArg.guideId}/owners` }),
        providesTags: ["Guides"],
      }),
      findGuideMembers: build.query<
        FindGuideMembersApiResponse,
        FindGuideMembersApiArg
      >({
        query: (queryArg) => ({ url: `/guides/${queryArg.guideId}/members` }),
        providesTags: ["Guides"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as wildguideApi };
export type FindGuideApiResponse = /** status 200 OK */ Guide;
export type FindGuideApiArg = {
  guideId: number;
};
export type UpdateGuideApiResponse = /** status 200 OK */ Guide;
export type UpdateGuideApiArg = {
  guideId: number;
  guideBase: GuideBase;
};
export type DeleteGuideApiResponse = unknown;
export type DeleteGuideApiArg = {
  guideId: number;
};
export type FindEntryApiResponse = /** status 200 OK */ Entry;
export type FindEntryApiArg = {
  guideId: number;
  entryId: number;
};
export type UpdateEntryApiResponse = /** status 200 OK */ Entry;
export type UpdateEntryApiArg = {
  guideId: number;
  entryId: number;
  entryBase: EntryBase;
};
export type DeleteEntryApiResponse = unknown;
export type DeleteEntryApiArg = {
  guideId: number;
  entryId: number;
};
export type RegisterApiResponse = /** status 200 OK */ Tokens;
export type RegisterApiArg = {
  user: User;
};
export type RefreshApiResponse = /** status 200 OK */ Tokens;
export type RefreshApiArg = void;
export type LoginApiResponse = /** status 200 OK */ Tokens;
export type LoginApiArg = {
  userLogin: UserLogin;
};
export type FindGuidesApiResponse = /** status 200 OK */ PagedGuide;
export type FindGuidesApiArg = {
  page?: number;
};
export type CreateGuideApiResponse = /** status 200 OK */ Guide;
export type CreateGuideApiArg = {
  guideBase: GuideBase;
};
export type OwnerJoinGuideApiResponse = /** status 200 OK */ boolean;
export type OwnerJoinGuideApiArg = {
  guideId: number;
  ownerId: number;
};
export type OwnerLeaveGuideApiResponse = /** status 200 OK */ boolean;
export type OwnerLeaveGuideApiArg = {
  guideId: number;
  ownerId: number;
};
export type MemberJoinGuideApiResponse = /** status 200 OK */ boolean;
export type MemberJoinGuideApiArg = {
  guideId: number;
  memberId: number;
};
export type MemberLeaveGuideApiResponse = /** status 200 OK */ boolean;
export type MemberLeaveGuideApiArg = {
  guideId: number;
  memberId: number;
};
export type FindEntriesApiResponse = /** status 200 OK */ PagedEntry;
export type FindEntriesApiArg = {
  guideId: number;
  page?: number;
};
export type CreateEntryApiResponse = /** status 200 OK */ Entry;
export type CreateEntryApiArg = {
  guideId: number;
  entryBase: EntryBase;
};
export type GetVersionApiResponse = /** status 200 OK */ Version;
export type GetVersionApiArg = void;
export type FindGuideOwnersApiResponse = /** status 200 OK */ number[];
export type FindGuideOwnersApiArg = {
  guideId: number;
};
export type FindGuideMembersApiResponse = /** status 200 OK */ number[];
export type FindGuideMembersApiArg = {
  guideId: number;
};
export type Guide = {
  name: string;
  description?: string;
  visibility: "PUBLIC" | "PRIVATE";
  inaturalistCriteria?: string;
  id: number;
};
export type GuideBase = {
  name: string;
  description?: string;
  visibility: "PUBLIC" | "PRIVATE";
  inaturalistCriteria?: string;
};
export type Entry = {
  name: string;
  summary?: string;
  description?: string;
  inaturalistTaxon?: number;
  id: number;
  guideId: number;
};
export type EntryBase = {
  name: string;
  summary?: string;
  description?: string;
  inaturalistTaxon?: number;
};
export type Tokens = {
  userId: number;
  username: string;
  accessToken: string;
  refreshToken: string;
};
export type User = {
  username: string;
  password: string;
};
export type UserLogin = {
  username: string;
  password: string;
};
export type PagedGuide = {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  data: Guide[];
};
export type PagedEntry = {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  data: Entry[];
};
export type Version = {
  appVersion: string;
  branch: string;
  commitId: string;
  commitTime: string;
  buildTime: string;
};
export const {
  useFindGuideQuery,
  useUpdateGuideMutation,
  useDeleteGuideMutation,
  useFindEntryQuery,
  useUpdateEntryMutation,
  useDeleteEntryMutation,
  useRegisterMutation,
  useRefreshMutation,
  useLoginMutation,
  useFindGuidesQuery,
  useCreateGuideMutation,
  useOwnerJoinGuideMutation,
  useOwnerLeaveGuideMutation,
  useMemberJoinGuideMutation,
  useMemberLeaveGuideMutation,
  useFindEntriesQuery,
  useCreateEntryMutation,
  useGetVersionQuery,
  useFindGuideOwnersQuery,
  useFindGuideMembersQuery,
} = injectedRtkApi;
