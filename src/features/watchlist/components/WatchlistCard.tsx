// src/features/watchlist/components/WatchlistCard.tsx
import type { WatchlistEntry } from "../api/watchlist.gql";

type Props = {
    entry: WatchlistEntry;
    isRemoving: boolean;
    onEditNotes: () => void;
    onRemove: () => void;
};

export function WatchlistCard({
    entry,
    isRemoving,
    onEditNotes,
    onRemove,
}: Props) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="text-sm font-semibold">
                        {entry.player.name}
                    </div>

                    <div className="mt-1 text-xs text-white/60">
                        {entry.player.position} • {entry.player.team}
                    </div>

                    <div className="mt-1 text-xs text-white/60">
                        {entry.player.nationality} • Age {entry.player.age} • #
                        {entry.player.shirtNumber}
                    </div>

                    <div className="mt-2 text-[11px] text-white/40">
                        Added: {new Date(entry.addedAt).toLocaleString()}
                    </div>
                </div>
            </div>

            <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-[11px] text-white/50">Notes</div>
                <div className="mt-1 text-sm text-white/80">
                    {entry.notes?.trim() ? (
                        entry.notes
                    ) : (
                        <span className="text-white/40">—</span>
                    )}
                </div>
            </div>

            <div className="mt-3 flex gap-2">
                <button
                    onClick={onEditNotes}
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                >
                    Edit notes
                </button>

                <button
                    onClick={onRemove}
                    disabled={isRemoving}
                    className="rounded-xl border border-white/10 bg-red-500/10 px-3 py-2 text-sm hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isRemoving ? "Removing..." : "Remove from watchlist"}
                </button>
            </div>
        </div>
    );
}
