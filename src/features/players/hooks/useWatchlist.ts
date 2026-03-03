import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "../../../shared/api/graphqlClient";
import {
    GET_WATCHLIST,
    type GetWatchlistResponse,
    type WatchlistEntry,
} from "../../watchlist/api/watchlist.gql";

export const watchlistKeys = {
    all: ["watchlist"] as const,
};

export function useWatchlist() {
    return useQuery<WatchlistEntry[]>({
        queryKey: watchlistKeys.all,
        queryFn: async () => {
            const data =
                await graphqlClient.request<GetWatchlistResponse>(
                    GET_WATCHLIST
                );
            return data.watchlist;
        },
        staleTime: 30_000,
    });
}
