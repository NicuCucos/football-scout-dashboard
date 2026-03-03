import type { Position } from "./players.gql";

export const playersKeys = {
    all: ["players"] as const,
    search: (args: {
        query: string;
        position: Position | null;
        team: string;
    }) => [...playersKeys.all, "search", args] as const,
};
