import { selectAuthUserId } from "@/auth/authSlice";
import { useFindGuideOwnersQuery } from "@/redux/api/wildguideApi";
import { useAppSelector } from "@/redux/hooks";

export function useIsOwner(guideId: number) {
    const userId = useAppSelector(selectAuthUserId);
    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
        refetch
    } = useFindGuideOwnersQuery({ guideId });
    return {
        isOwner: data?.map(owner => owner.userId).includes(userId ?? -1) ?? false,
        isLoading,
        isFetching,
        isError,
        error,
        refetch
    };
}