import { NavLink } from "react-router-dom";

export const NavItem = ({
    to,
    label,
    icon,
    collapsed,
}: {
    to: string;
    label: string;
    icon: string;
    collapsed: boolean;
}) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                [
                    "group flex items-center gap-3 rounded-xl px-3 py-2 transition",
                    "border border-transparent",
                    isActive
                        ? "bg-emerald-500/12 border-emerald-500/25 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.15)]"
                        : "hover:bg-white/6 hover:border-white/10",
                ].join(" ")
            }
            title={collapsed ? label : undefined}
        >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10 group-hover:bg-white/10">
                {icon}
            </span>

            {!collapsed && (
                <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{label}</div>
                    <div className="truncate text-xs text-white/55">
                        {label === "Players"
                            ? "Search & filter"
                            : label === "Watchlist"
                              ? "Notes & edits"
                              : "Status controls"}
                    </div>
                </div>
            )}

            {!collapsed && (
                <span className="ml-auto h-2 w-2 rounded-full bg-emerald-400/0 group-[.active]:bg-emerald-400/90" />
            )}
        </NavLink>
    );
};
