import { useMemo, useState } from "react";
import { NavItem } from "./NavItem";

type Nav = { to: string; label: string; icon: string };

export const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);

    const navItems: Nav[] = useMemo(
        () => [
            { to: "/players", label: "Players", icon: "👤" },
            { to: "/watchlist", label: "Watchlist", icon: "⭐" },
            { to: "/matches", label: "Matches", icon: "📅" },
        ],
        []
    );

    return (
        <aside
            className={[
                "sticky top-3 block h-[calc(100dvh-24px)] shrink-0",
                collapsed ? "w-[76px]" : "w-[280px]",
            ].join(" ")}
        >
            <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
                <div
                    className={[
                        "flex items-center border-b border-white/10 px-3 py-3",
                        collapsed ? "justify-center" : "justify-between",
                    ].join(" ")}
                >
                    {!collapsed ? (
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/15 ring-1 ring-emerald-500/25">
                                ⚽
                            </div>

                            <div className="min-w-0">
                                <div className="truncate text-sm font-semibold">
                                    Scout Desk
                                </div>
                                <div className="truncate text-xs text-white/55">
                                    Search • Watch • Matches
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div />
                    )}
                    <button
                        onClick={() => setCollapsed((v) => !v)}
                        className="rounded-xl border border-white/10 bg-white/5 px-2 py-2 text-xs text-white/70 hover:bg-white/10 cursor-pointer"
                        aria-label={
                            collapsed ? "Expand sidebar" : "Collapse sidebar"
                        }
                        title={collapsed ? "Expand" : "Collapse"}
                    >
                        {collapsed ? "»" : "«"}
                    </button>
                </div>

                <nav className="p-2">
                    <div className="space-y-1">
                        {navItems.map((item) => (
                            <NavItem
                                key={item.to}
                                to={item.to}
                                label={item.label}
                                icon={item.icon}
                                collapsed={collapsed}
                            />
                        ))}
                    </div>
                </nav>
            </div>
        </aside>
    );
};
