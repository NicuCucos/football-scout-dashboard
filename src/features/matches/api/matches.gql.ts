import { gql } from "graphql-request";

export type MatchStatus =
    | "SCHEDULED"
    | "LIVE"
    | "FINISHED"
    | "POSTPONED"
    | "CANCELLED";

export type Match = {
    id: string;
    homeTeam: string;
    awayTeam: string;
    date: string;
    competition: string;
    status: MatchStatus;
};

export type GetMatchesResponse = { matches: Match[] };
export type GetMatchesVariables = {
    team?: string | null;
    status?: MatchStatus | null;
};

export type UpdateMatchStatusVariables = {
    matchId: string;
    status: MatchStatus;
};
export type UpdateMatchStatusResponse = {
    updateMatchStatus: { id: string; status: MatchStatus };
};

export const GET_MATCHES = gql`
    query Matches($status: MatchStatus, $team: String) {
        matches(status: $status, team: $team) {
            id
            homeTeam
            awayTeam
            date
            competition
            status
        }
    }
`;

export const UPDATE_MATCH_STATUS = gql`
    mutation UpdateMatchStatus($matchId: ID!, $status: MatchStatus!) {
        updateMatchStatus(matchId: $matchId, status: $status) {
            id
            status
        }
    }
`;
