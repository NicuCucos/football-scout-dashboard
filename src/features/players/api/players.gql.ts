export type Position = "Forward" | "Midfielder" | "Defender" | "Goalkeeper";

export type Player = {
    id: string;
    name: string;
    position: Position;
    team: string;
    nationality: string;
    age: number;
    shirtNumber: number;
};

export type SearchPlayersResponse = {
    searchPlayers: Player[];
};

export type SearchPlayersVariables = {
    query?: string | null;
    position?: Position | null;
    team?: string | null;
};

export const SEARCH_PLAYERS_QUERY = `
    query SearchPlayers($query: String, $position: Position, $team: String) {
        searchPlayers(query: $query, position: $position, team: $team) {
            id
            name
            position
            team
            nationality
            age
            shirtNumber
        }
    }
`;
