// src/features/watchlist/components/EditNotesModal.tsx
import { useState, type FC } from "react";
import type { WatchlistEntry } from "../api/watchlist.gql";

type Props = {
    open: boolean;
    entry: WatchlistEntry | null;
    isSaving: boolean;
    onClose: () => void;
    onSave: (notes: string) => void;
};

export const EditNotesModal: FC<Props> = ({
    open,
    entry,
    isSaving,
    onClose,
    onSave,
}) => {
    if (!open || !entry) return null;

    return (
        <EditNotesModalInner
            key={entry.id}
            entry={entry}
            isSaving={isSaving}
            onClose={onClose}
            onSave={onSave}
        />
    );
};

type InnerProps = {
    entry: WatchlistEntry;
    isSaving: boolean;
    onClose: () => void;
    onSave: (notes: string) => void;
};

function EditNotesModalInner({ entry, isSaving, onClose, onSave }: InnerProps) {
    const [notes, setNotes] = useState(entry.notes ?? "");

    return (
        <div className="fixed inset-0 z-50">
            <button
                className="absolute inset-0 bg-black/60"
                onClick={onClose}
                aria-label="Close modal"
            />

            <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-[#0b0f1a] p-5 shadow-2xl">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="text-base font-semibold">
                            Edit notes
                        </div>
                        <div className="mt-1 text-sm text-white/60">
                            {entry.player.name} • {entry.player.team} •{" "}
                            {entry.player.position}
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10 disabled:opacity-50"
                    >
                        Close
                    </button>
                </div>

                <div className="mt-4">
                    <label className="mb-1 block text-xs text-white/60">
                        Notes
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                        className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-white/20"
                    />
                    <div className="mt-1 text-xs text-white/40">
                        {notes.length}/300
                    </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => onSave(notes.trim().slice(0, 300))}
                        disabled={isSaving}
                        className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm hover:bg-white/20 disabled:opacity-50"
                    >
                        {isSaving ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}
