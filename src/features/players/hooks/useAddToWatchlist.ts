import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { graphqlClient } from "../../../shared/api/graphqlClient";
import type { Player } from "../../players/api/players.gql";
import {
    ADD_TO_WATCHLIST,
    type AddToWatchlistResponse,
    type AddToWatchlistVariables,
    type WatchlistEntry,
} from "../../watchlist/api/watchlist.gql";
import { watchlistKeys } from "./useWatchlist";

type Vars = AddToWatchlistVariables & { player: Player };
type Ctx = { prev: WatchlistEntry[]; optimisticId: string };

export const useAddToWatchlist = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async ({ playerId, notes }: Vars) => {
            return graphqlClient.request<
                AddToWatchlistResponse,
                AddToWatchlistVariables
            >(ADD_TO_WATCHLIST, { playerId, notes });
        },

        onMutate: async ({ playerId, notes, player }): Promise<Ctx> => {
            await qc.cancelQueries({ queryKey: watchlistKeys.all });
            const prev =
                qc.getQueryData<WatchlistEntry[]>(watchlistKeys.all) ?? [];
            if (prev.some((e) => e.player.id === playerId)) {
                return { prev, optimisticId: "" };
            }

            const optimisticId = `optimistic-${playerId}-${Date.now()}`;

            const optimisticEntry: WatchlistEntry = {
                id: optimisticId,
                addedAt: new Date().toISOString(),
                notes: notes ?? null,
                player,
            };

            qc.setQueryData<WatchlistEntry[]>(watchlistKeys.all, [
                optimisticEntry,
                ...prev,
            ]);

            return { prev, optimisticId };
        },

        onError: (_err, _vars, ctx) => {
            if (ctx?.prev) qc.setQueryData(watchlistKeys.all, ctx.prev);
            toast.error("Could not add to watchlist.");
        },

        onSuccess: (data, _vars, ctx) => {
            const entry = data.addToWatchlist;
            if (ctx?.optimisticId) {
                const current =
                    qc.getQueryData<WatchlistEntry[]>(watchlistKeys.all) ?? [];
                qc.setQueryData<WatchlistEntry[]>(
                    watchlistKeys.all,
                    current.map((e) => (e.id === ctx.optimisticId ? entry : e))
                );
            }
            toast.success("Added to watchlist!");
        },

        onSettled: () => {
            qc.invalidateQueries({ queryKey: watchlistKeys.all });
        },
    });
};
