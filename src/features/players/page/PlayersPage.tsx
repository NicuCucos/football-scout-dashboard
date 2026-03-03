import { useMemo, useState } from "react";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import type { Player, Position } from "../api/players.gql";
import { AddToWatchlistModal } from "../components/AddToWatchlistModal";
import { PlayerCard } from "../components/PlayerCard";
import { useAddToWatchlist } from "../hooks/useAddToWatchlist";
import { useRemoveFromWatchlist } from "../hooks/useRemoveFromWatchlist";
import { useSearchPlayers } from "../hooks/useSearchPlayers";
import { useWatchlist } from "../hooks/useWatchlist";

const positionOptions: Array<{ label: string; value: Position }> = [
    { label: "Forward", value: "Forward" },
    { label: "Midfielder", value: "Midfielder" },
    { label: "Defender", value: "Defender" },
    { label: "Goalkeeper", value: "Goalkeeper" },
];

export const PlayersPage = () => {
    const [search, setSearch] = useState("");
    const [position, setPosition] = useState<Position | null>(null);
    const [team, setTeam] = useState("");

    const debouncedSearch = useDebounce(search, 400);
    const debouncedTeam = useDebounce(team, 400);

    const { data, isLoading, isError, error, refetch, isFetching } =
        useSearchPlayers({
            query: debouncedSearch,
            position,
            team: debouncedTeam,
        });

    const players: Player[] = useMemo(() => data?.searchPlayers ?? [], [data]);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

    // watchlist
    const watchlistQuery = useWatchlist();
    const watchlistEntries = useMemo(
        () => watchlistQuery.data ?? [],
        [watchlistQuery.data]
    );
    const entryByPlayerId = useMemo(() => {
        const m = new Map<string, (typeof watchlistEntries)[number]>();
        for (const e of watchlistEntries) m.set(e.player.id, e);
        return m;
    }, [watchlistEntries]);

    const addToWatchlist = useAddToWatchlist();
    const removeFromWatchlist = useRemoveFromWatchlist();

    return (
        <div className="space-y-4">
            {/* Header row */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex-1">
                    <div className="text-lg font-semibold tracking-tight">
                        Player Search
                    </div>
                    <div className="mt-1 text-sm text-white/60">
                        Search by name, nationality, or use filters.
                    </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-white/60">
                    {isFetching && !isLoading ? (
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                            Updating…
                        </span>
                    ) : (
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                            {players.length} players
                        </span>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs text-white/60">
                        Search
                    </label>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="e.g. Haaland, Barcelona, Brazil…"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-white/20"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-xs text-white/60">
                        Position
                    </label>
                    <select
                        value={position ?? ""}
                        onChange={(e) =>
                            setPosition(
                                (e.target.value || null) as Position | null
                            )
                        }
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/20"
                    >
                        <option value="" className="text-black">
                            All
                        </option>
                        {positionOptions.map((p) => (
                            <option
                                key={p.value}
                                value={p.value}
                                className="text-black"
                            >
                                {p.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="sm:col-span-2 lg:col-span-3 flex flex-wrap gap-2">
                    <button
                        onClick={() => {
                            setSearch("");
                            setTeam("");
                            setPosition(null);
                        }}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                    >
                        Clear filters
                    </button>
                </div>
            </div>

            {/* States */}
            {isLoading && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                    <div className="text-sm text-white/70">
                        Loading players…
                    </div>
                </div>
            )}

            {isError && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
                    <div className="text-sm font-semibold">
                        Failed to load players
                    </div>
                    <div className="mt-2 text-xs text-white/70">
                        {(error as Error)?.message ?? "Unknown error"}
                    </div>
                    <button
                        onClick={() => refetch()}
                        className="mt-4 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                    >
                        Retry
                    </button>
                </div>
            )}

            {!isLoading && !isError && players.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                    <div className="text-sm font-semibold">
                        No players found
                    </div>
                    <div className="mt-1 text-sm text-white/60">
                        Try a different search term or reset filters.
                    </div>
                </div>
            )}

            {/* Cards grid */}
            {!isLoading && !isError && players.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {players.map((p) => {
                        const entry = entryByPlayerId.get(p.id);
                        const inWatchlist = Boolean(entry);

                        const isRemovingThis =
                            removeFromWatchlist.isPending &&
                            removeFromWatchlist.variables?.id === entry?.id;

                        const isLoading =
                            addToWatchlist.isPending || isRemovingThis;

                        return (
                            <PlayerCard
                                key={p.id}
                                player={p}
                                inWatchlist={inWatchlist}
                                loading={isLoading}
                                onAdd={() => {
                                    setSelectedPlayer(p);
                                    setModalOpen(true);
                                }}
                                onRemove={() => {
                                    if (!entry) return;
                                    if (entry.id.startsWith("optimistic-")) {
                                        removeFromWatchlist.mutate({
                                            id: entry.id,
                                        });
                                        return;
                                    }
                                    removeFromWatchlist.mutate({
                                        id: entry.id,
                                    });
                                }}
                            />
                        );
                    })}
                </div>
            )}
            <AddToWatchlistModal
                open={modalOpen}
                player={selectedPlayer}
                isSaving={addToWatchlist.isPending}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedPlayer(null);
                }}
                onSave={(notes) => {
                    if (!selectedPlayer) return;

                    addToWatchlist.mutate(
                        {
                            playerId: selectedPlayer.id,
                            player: selectedPlayer,
                            notes: notes || null,
                        },
                        {
                            onSuccess: () => {
                                setModalOpen(false);
                                setSelectedPlayer(null);
                            },
                        }
                    );
                }}
            />
        </div>
    );
};
