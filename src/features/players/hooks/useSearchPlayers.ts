import { useQuery } from "@tanstack/react-query";
import type { Position } from "../api/players.gql";
import { playersKeys } from "../api/players.keys";
import { searchPlayers } from "../api/players.service";

type Args = {
    query: string;
    position: Position | null;
    team: string;
};

export function useSearchPlayers({ query, position, team }: Args) {
    const q = query.trim();
    const t = team.trim();

    return useQuery({
        queryKey: playersKeys.search({ query: q, position, team: t }),
        queryFn: () => searchPlayers({ query: q, position, team: t }),
        placeholderData: (prev) => prev,
    });
}
