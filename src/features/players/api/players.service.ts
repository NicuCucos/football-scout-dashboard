import { gqlRequest } from "../../../shared/api/graphqlClient";
import {
    SEARCH_PLAYERS_QUERY,
    type Position,
    type SearchPlayersResponse,
    type SearchPlayersVariables,
} from "./players.gql";

export type SearchPlayersArgs = {
    query: string;
    position: Position | null;
    team: string;
};

export async function searchPlayers({
    query,
    position,
    team,
}: SearchPlayersArgs) {
    const q = query.trim();
    const t = team.trim();

    const variables: SearchPlayersVariables = {
        query: q.length ? q : null,
        position: position ?? null,
        team: t.length ? t : null,
    };

    return gqlRequest<SearchPlayersResponse, SearchPlayersVariables>(
        SEARCH_PLAYERS_QUERY,
        variables
    );
}
