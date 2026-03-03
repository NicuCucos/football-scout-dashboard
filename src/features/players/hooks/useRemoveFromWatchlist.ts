// src/features/watchlist/hooks/useRemoveFromWatchlist.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { graphqlClient } from "../../../shared/api/graphqlClient";
import {
    REMOVE_FROM_WATCHLIST,
    type RemoveFromWatchlistResponse,
    type RemoveFromWatchlistVariables,
    type WatchlistEntry,
} from "../../watchlist/api/watchlist.gql";
import { watchlistKeys } from "./useWatchlist";

type Ctx = { prev: WatchlistEntry[] };

export const useRemoveFromWatchlist = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (vars: RemoveFromWatchlistVariables) => {
            return graphqlClient.request<
                RemoveFromWatchlistResponse,
                RemoveFromWatchlistVariables
            >(REMOVE_FROM_WATCHLIST, vars);
        },

        onMutate: async ({ id }): Promise<Ctx> => {
            await qc.cancelQueries({ queryKey: watchlistKeys.all });
            const prev =
                qc.getQueryData<WatchlistEntry[]>(watchlistKeys.all) ?? [];

            qc.setQueryData<WatchlistEntry[]>(
                watchlistKeys.all,
                prev.filter((e) => e.id !== id)
            );

            return { prev };
        },

        onError: (_err, _vars, ctx) => {
            if (ctx?.prev) qc.setQueryData(watchlistKeys.all, ctx.prev);
            toast.error("Could not remove from watchlist.");
        },

        onSuccess: (data) => {
            if (data.removeFromWatchlist)
                toast.success("Removed from watchlist!");
            else toast.error("Remove failed.");
        },

        onSettled: () => {
            qc.invalidateQueries({ queryKey: watchlistKeys.all });
        },
    });
};
