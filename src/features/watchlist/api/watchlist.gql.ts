import { gql } from "graphql-request";
import type { Player } from "../../players/api/players.gql";

export type WatchlistEntry = {
    id: string;
    addedAt: string;
    notes?: string | null;
    player: Player;
};

export type GetWatchlistResponse = { watchlist: WatchlistEntry[] };

export type AddToWatchlistVariables = {
    playerId: string;
    notes?: string | null;
};
export type AddToWatchlistResponse = { addToWatchlist: WatchlistEntry };

export type UpdateWatchlistEntryVariables = {
    id: string;
    notes?: string | null;
};

export type UpdateWatchlistEntryResponse = {
    updateWatchlistEntry: {
        id: string;
        addedAt: string;
        notes?: string | null;
        player: {
            id: string;
            name: string;
            position: "Forward" | "Midfielder" | "Defender" | "Goalkeeper";
            team: string;
            nationality: string;
            age: number;
            shirtNumber: number;
        };
    } | null;
};

export type RemoveFromWatchlistVariables = { id: string };
export type RemoveFromWatchlistResponse = { removeFromWatchlist: boolean };

export const GET_WATCHLIST = gql`
    query GetWatchlist {
        watchlist {
            id
            addedAt
            notes
            player {
                id
                name
                position
                team
                nationality
                age
                shirtNumber
            }
        }
    }
`;

export const ADD_TO_WATCHLIST = gql`
    mutation AddToWatchlist($playerId: ID!, $notes: String) {
        addToWatchlist(playerId: $playerId, notes: $notes) {
            id
            addedAt
            notes
            player {
                id
                name
                position
                team
                nationality
                age
                shirtNumber
            }
        }
    }
`;

export const REMOVE_FROM_WATCHLIST = gql`
    mutation RemoveFromWatchlist($id: ID!) {
        removeFromWatchlist(id: $id)
    }
`;

export const UPDATE_WATCHLIST_ENTRY = gql`
    mutation UpdateWatchlistEntry($id: ID!, $notes: String) {
        updateWatchlistEntry(id: $id, notes: $notes) {
            id
            notes
        }
    }
`;
