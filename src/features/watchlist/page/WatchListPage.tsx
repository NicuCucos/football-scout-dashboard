// src/features/watchlist/pages/WatchlistPage.tsx
import { useMemo, useState } from "react";
import { useRemoveFromWatchlist } from "../../players/hooks/useRemoveFromWatchlist";
import { useWatchlist } from "../../players/hooks/useWatchlist";
import type { WatchlistEntry } from "../api/watchlist.gql";
import { EditNotesModal } from "../components/EditNotesModal";
import { WatchlistCard } from "../components/WatchlistCard";
import { useUpdateWatchlistEntry } from "../hooks/useUpdateWatchlistEntry";

export const WatchListPage = () => {
    const watchlistQuery = useWatchlist();
    const removeEntry = useRemoveFromWatchlist();
    const updateEntry = useUpdateWatchlistEntry();

    const entries = useMemo(
        () => watchlistQuery.data ?? [],
        [watchlistQuery.data]
    );
    const sorted = useMemo(() => {
        return [...entries].sort((a, b) => b.addedAt.localeCompare(a.addedAt));
    }, [entries]);

    const [editOpen, setEditOpen] = useState(false);
    const [selected, setSelected] = useState<WatchlistEntry | null>(null);

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <div className="text-lg font-semibold tracking-tight">
                        Watchlist
                    </div>
                    <div className="mt-1 text-sm text-white/60">
                        Manage your saved players and notes.
                    </div>
                </div>

                <div className="text-xs text-white/60">
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                        {sorted.length} entries
                    </span>
                </div>
            </div>

            {watchlistQuery.isLoading && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                    <div className="text-sm text-white/70">
                        Loading watchlist…
                    </div>
                </div>
            )}

            {watchlistQuery.isError && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
                    <div className="text-sm font-semibold">
                        Failed to load watchlist
                    </div>
                    <div className="mt-2 text-xs text-white/70">
                        {(watchlistQuery.error as Error)?.message ??
                            "Unknown error"}
                    </div>
                    <button
                        onClick={() => watchlistQuery.refetch()}
                        className="mt-4 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                    >
                        Retry
                    </button>
                </div>
            )}

            {!watchlistQuery.isLoading &&
                !watchlistQuery.isError &&
                sorted.length === 0 && (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                        <div className="text-sm font-semibold">
                            Your watchlist is empty
                        </div>
                        <div className="mt-1 text-sm text-white/60">
                            Add players from the Player Search page.
                        </div>
                    </div>
                )}

            {!watchlistQuery.isLoading &&
                !watchlistQuery.isError &&
                sorted.length > 0 && (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {sorted.map((e) => {
                            const isRemoving =
                                removeEntry.isPending &&
                                removeEntry.variables?.id === e.id;

                            return (
                                <WatchlistCard
                                    key={e.id}
                                    entry={e}
                                    isRemoving={isRemoving}
                                    onEditNotes={() => {
                                        setSelected(e);
                                        setEditOpen(true);
                                    }}
                                    onRemove={() =>
                                        removeEntry.mutate({ id: e.id })
                                    }
                                />
                            );
                        })}
                    </div>
                )}

            <EditNotesModal
                open={editOpen}
                entry={selected}
                isSaving={updateEntry.isPending}
                onClose={() => {
                    setEditOpen(false);
                    setSelected(null);
                }}
                onSave={(notes) => {
                    if (!selected) return;

                    updateEntry.mutate(
                        { id: selected.id, notes: notes || null },
                        {
                            onSuccess: () => {
                                setEditOpen(false);
                                setSelected(null);
                            },
                        }
                    );
                }}
            />
        </div>
    );
};
