import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "../../../shared/api/graphqlClient";
import {
    GET_MATCHES,
    type GetMatchesResponse,
    type GetMatchesVariables,
} from "../api/matches.gql";

export const matchesKeys = {
    list: (vars: GetMatchesVariables) => ["matches", "list", vars] as const,
};

export function useMatches(vars: GetMatchesVariables) {
    return useQuery({
        queryKey: matchesKeys.list(vars),
        queryFn: async () => {
            const data = await graphqlClient.request<
                GetMatchesResponse,
                GetMatchesVariables
            >(GET_MATCHES, vars);
            return data.matches;
        },
        staleTime: 15_000,
        placeholderData: (prev) => prev,
    });
}
