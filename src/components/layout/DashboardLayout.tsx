import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar/Sidebar";

export const DashboardLayout = () => {
    return (
        <div className="h-dvh w-full overflow-x-hidden bg-zinc-950 text-zinc-100">
            <div className="pointer-events-none fixed inset-0 z-0 opacity-40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,197,94,0.12),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.10),transparent_45%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
            </div>

            <div className="relative z-10 flex h-dvh w-full gap-4 p-3 sm:p-4">
                <Sidebar />

                <main className="min-w-0 flex-1">
                    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
                        <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
                            <div>
                                <div className="text-sm text-white/60">
                                    Football Scout Dashboard
                                </div>
                                <div className="text-lg font-semibold tracking-tight">
                                    Scout Panel
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="hidden sm:block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                                    Local GraphQL
                                </div>
                            </div>
                        </div>
                        <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-6">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};
