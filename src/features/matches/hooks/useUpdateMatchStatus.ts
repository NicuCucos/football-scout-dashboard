import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { graphqlClient } from "../../../shared/api/graphqlClient";
import {
    UPDATE_MATCH_STATUS,
    type Match,
    type MatchStatus,
    type UpdateMatchStatusResponse,
    type UpdateMatchStatusVariables,
} from "../api/matches.gql";
import { matchesKeys } from "./useMatches";

type Vars = UpdateMatchStatusVariables & {
    currentListVars: { team?: string | null; status?: MatchStatus | null };
};

type Ctx = { prev: Match[] };

export function useUpdateMatchStatus() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async ({ matchId, status }: Vars) => {
            return graphqlClient.request<
                UpdateMatchStatusResponse,
                UpdateMatchStatusVariables
            >(UPDATE_MATCH_STATUS, { matchId, status });
        },

        onMutate: async ({
            matchId,
            status,
            currentListVars,
        }): Promise<Ctx> => {
            const key = matchesKeys.list(currentListVars);

            await qc.cancelQueries({ queryKey: key });
            const prev = qc.getQueryData<Match[]>(key) ?? [];

            const next = prev
                .map((m) => (m.id === matchId ? { ...m, status } : m))
                .filter((m) => {
                    const filterStatus = currentListVars.status ?? null;
                    return !filterStatus || m.status === filterStatus;
                });

            qc.setQueryData<Match[]>(key, next);

            return { prev };
        },

        onError: (_err, vars, ctx) => {
            const key = matchesKeys.list(vars.currentListVars);
            if (ctx?.prev) qc.setQueryData(key, ctx.prev);
            toast.error("Could not update match status.");
        },

        onSuccess: () => {
            toast.success("Match status updated!");
        },

        onSettled: () => {
            qc.invalidateQueries({ queryKey: ["matches"] });
        },
    });
}
