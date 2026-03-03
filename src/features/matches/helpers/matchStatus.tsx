import type { MatchStatus } from "../api/matches.gql";

export const MATCH_STATUS_OPTIONS: Array<{
    label: string;
    value: MatchStatus;
}> = [
    { label: "Scheduled", value: "SCHEDULED" },
    { label: "Live", value: "LIVE" },
    { label: "Finished", value: "FINISHED" },
    { label: "Postponed", value: "POSTPONED" },
    { label: "Cancelled", value: "CANCELLED" },
];

export function getMatchStatusLabel(status: MatchStatus): string {
    const found = MATCH_STATUS_OPTIONS.find((s) => s.value === status);
    return found?.label ?? status;
}

export function getMatchStatusClasses(status: MatchStatus): string {
    switch (status) {
        case "LIVE":
            return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";

        case "SCHEDULED":
            return "border-blue-500/30 bg-blue-500/10 text-blue-400";

        case "FINISHED":
            return "border-white/20 bg-white/5 text-white/70";

        case "POSTPONED":
            return "border-amber-500/30 bg-amber-500/10 text-amber-400";

        case "CANCELLED":
            return "border-red-500/30 bg-red-500/10 text-red-400";

        default:
            return "border-white/10 bg-white/5 text-white";
    }
}
