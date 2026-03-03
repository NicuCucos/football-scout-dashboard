import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { graphqlClient } from "../../../shared/api/graphqlClient";
import { watchlistKeys } from "../../players/hooks/useWatchlist";
import {
    UPDATE_WATCHLIST_ENTRY,
    type UpdateWatchlistEntryResponse,
    type UpdateWatchlistEntryVariables,
    type WatchlistEntry,
} from "../api/watchlist.gql";

type Ctx = { prev: WatchlistEntry[] };

export function useUpdateWatchlistEntry() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (vars: UpdateWatchlistEntryVariables) => {
            return graphqlClient.request<
                UpdateWatchlistEntryResponse,
                UpdateWatchlistEntryVariables
            >(UPDATE_WATCHLIST_ENTRY, vars);
        },

        onMutate: async ({ id, notes }): Promise<Ctx> => {
            await qc.cancelQueries({ queryKey: watchlistKeys.all });
            const prev =
                qc.getQueryData<WatchlistEntry[]>(watchlistKeys.all) ?? [];

            // optimistic: update notes local
            qc.setQueryData<WatchlistEntry[]>(
                watchlistKeys.all,
                prev.map((e) =>
                    e.id === id ? { ...e, notes: notes ?? null } : e
                )
            );

            return { prev };
        },

        onError: (_err, _vars, ctx) => {
            if (ctx?.prev) qc.setQueryData(watchlistKeys.all, ctx.prev);
            toast.error("Could not update notes.");
        },

        onSuccess: (data) => {
            if (!data.updateWatchlistEntry) {
                toast.error("Update failed.");
                return;
            }
            toast.success("Notes updated!");
        },

        onSettled: () => {
            qc.invalidateQueries({ queryKey: watchlistKeys.all });
        },
    });
}
