import { useMemo, useState } from "react";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import type { MatchStatus } from "../api/matches.gql";
import { MatchCard } from "../components/MatchCard";
import { MATCH_STATUS_OPTIONS } from "../helpers/matchStatus";
import { useMatches } from "../hooks/useMatches";
import { useUpdateMatchStatus } from "../hooks/useUpdateMatchStatus";

export const MatchesPage = () => {
    const [team, setTeam] = useState("");
    const [status, setStatus] = useState<MatchStatus | null>(null);

    const debouncedTeam = useDebounce(team, 400);

    const listVars = useMemo(
        () => ({
            team: debouncedTeam ? debouncedTeam : null,
            status,
        }),
        [debouncedTeam, status]
    );

    const matchesQuery = useMatches(listVars);
    const updateStatus = useUpdateMatchStatus();

    const matches = useMemo(() => matchesQuery.data ?? [], [matchesQuery.data]);

    return (
        <div className="space-y-4">
            {/* Header row */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex-1">
                    <div className="text-lg font-semibold tracking-tight">
                        Upcoming Matches
                    </div>
                    <div className="mt-1 text-sm text-white/60">
                        Filter matches by status and team
                    </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-white/60">
                    {matchesQuery.isFetching && !matchesQuery.isLoading ? (
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                            Updating…
                        </span>
                    ) : (
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                            {matches.length} matches
                        </span>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs text-white/60">
                        Team
                    </label>
                    <input
                        value={team}
                        onChange={(e) => setTeam(e.target.value)}
                        placeholder="e.g. Arsenal, Barcelona…"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-white/20"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-xs text-white/60">
                        Status
                    </label>
                    <select
                        value={status ?? ""}
                        onChange={(e) =>
                            setStatus(
                                (e.target.value || null) as MatchStatus | null
                            )
                        }
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/20"
                    >
                        <option value="" className="text-black">
                            All
                        </option>
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
                </div>

                <div className="sm:col-span-2 lg:col-span-3 flex flex-wrap gap-2">
                    <button
                        onClick={() => {
                            setTeam("");
                            setStatus(null);
                        }}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                    >
                        Clear filters
                    </button>
                </div>
            </div>

            {/* States */}
            {matchesQuery.isLoading && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                    <div className="text-sm text-white/70">
                        Loading matches…
                    </div>
                </div>
            )}

            {matchesQuery.isError && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
                    <div className="text-sm font-semibold">
                        Failed to load matches
                    </div>
                    <div className="mt-2 text-xs text-white/70">
                        {(matchesQuery.error as Error)?.message ??
                            "Unknown error"}
                    </div>
                    <button
                        onClick={() => matchesQuery.refetch()}
                        className="mt-4 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                    >
                        Retry
                    </button>
                </div>
            )}

            {!matchesQuery.isLoading &&
                !matchesQuery.isError &&
                matches.length === 0 && (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                        <div className="text-sm font-semibold">
                            No matches found
                        </div>
                        <div className="mt-1 text-sm text-white/60">
                            Try changing the filters.
                        </div>
                    </div>
                )}

            {/* Grid */}
            {!matchesQuery.isLoading &&
                !matchesQuery.isError &&
                matches.length > 0 && (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {matches.map((m) => {
                            const isUpdatingThis =
                                updateStatus.isPending &&
                                updateStatus.variables?.matchId === m.id;

                            return (
                                <MatchCard
                                    key={m.id}
                                    match={m}
                                    isUpdating={isUpdatingThis}
                                    onChangeStatus={(next) =>
                                        updateStatus.mutate({
                                            matchId: m.id,
                                            status: next,
                                            currentListVars: listVars,
                                        })
                                    }
                                />
                            );
                        })}
                    </div>
                )}
        </div>
    );
};
