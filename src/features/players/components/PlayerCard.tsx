import { type FC } from "react";
import type { Player } from "../api/players.gql";

type Props = {
    player: Player;
    onAddToWatchlist?: (playerId: string) => void;
    isAdding?: boolean;
};

export const PlayerCard: FC<Props> = ({
    player,
    onAddToWatchlist,
    isAdding,
}) => {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="truncate text-base font-semibold">
                        {player.name}
                    </div>
                    <div className="mt-1 text-xs text-white/60">
                        {player.position} • {player.team}
                    </div>
                </div>

                <div className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70">
                    #{player.shirtNumber}
                </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <div className="text-[11px] text-white/60">Nationality</div>
                    <div className="truncate font-medium">
                        {player.nationality}
                    </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <div className="text-[11px] text-white/60">Age</div>
                    <div className="font-medium">{player.age}</div>
                </div>
            </div>

            <button
                onClick={() => onAddToWatchlist?.(player.id)}
                disabled={!onAddToWatchlist || isAdding}
                className="mt-4 w-full rounded-xl bg-emerald-500/90 px-3 py-2 text-sm font-semibold text-black hover:bg-emerald-500 disabled:opacity-60"
            >
                {isAdding ? "Adding..." : "Add to watchlist"}
            </button>
        </div>
    );
};
