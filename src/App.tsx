import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { MatchesPage } from "./features/matches/page/MatchesPage";
import { PlayersPage } from "./features/players/page/PlayersPage";
import { WatchListPage } from "./features/watchlist/page/WatchListPage";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 30_000,
        },
        mutations: { retry: 0 },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar
                newestOnTop
                closeOnClick
                draggable
                pauseOnHover
                theme="colored"
                style={{ zIndex: 99999 }}
            />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<DashboardLayout />}>
                        <Route
                            index
                            element={<Navigate to="/players" replace />}
                        />
                        <Route path="players" element={<PlayersPage />} />
                        <Route path="watchlist" element={<WatchListPage />} />
                        <Route path="matches" element={<MatchesPage />} />
                        <Route
                            path="*"
                            element={<Navigate to="/players" replace />}
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
