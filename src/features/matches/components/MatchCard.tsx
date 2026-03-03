import type { Match, MatchStatus } from "../api/matches.gql";
import {
    getMatchStatusClasses,
    getMatchStatusLabel,
    MATCH_STATUS_OPTIONS,
} from "../helpers/matchStatus";

type Props = {
    match: Match;
    isUpdating: boolean;
    onChangeStatus: (next: MatchStatus) => void;
};

export function MatchCard({ match, isUpdating, onChangeStatus }: Props) {
    const dateText = new Date(match.date).toLocaleString();

    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="text-sm font-semibold">
                        {match.homeTeam}{" "}
                        <span className="text-white/40">vs</span>{" "}
                        {match.awayTeam}
                    </div>
                    <div className="mt-1 text-xs text-white/60">
                        {match.competition} • {dateText}
                    </div>
                </div>

                <span
                    className={`rounded-full border px-2 py-1 text-xs ${getMatchStatusClasses(
                        match.status
                    )}`}
                >
                    {getMatchStatusLabel(match.status)}
                </span>
            </div>

            {/* Admin control */}
            <div className="mt-3 flex items-center gap-2">
                <div className="text-xs text-white/60">Status:</div>

                <select
                    value={match.status}
                    disabled={isUpdating}
                    onChange={(e) =>
                        onChangeStatus(e.target.value as MatchStatus)
                    }
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50"
                >
                    {MATCH_STATUS_OPTIONS.map((s) => (
                        <option
                            key={s.value}
                            value={s.value}
                            className="text-black"
                        >
                            {s.label}
                        </option>
                    ))}
                </select>

                {isUpdating && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs">
                        Updating…
                    </span>
                )}
            </div>
        </div>
    );
}
