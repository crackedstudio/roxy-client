import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Landing } from "@/pages/Landing";
import { Dashboard } from "@/pages/Dashboard";
import { Markets } from "@/pages/Markets";
import { Portfolio } from "@/pages/Portfolio";
import { Leaderboard } from "@/pages/Leaderboard";
import { Guilds } from "@/pages/Guilds";
import { Navbar } from "@/components/Navbar";
import { CanvasBackground } from "@/components/CanvasBackground";

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-background text-text">
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route
                        path="/app/*"
                        element={
                            <>
                                <CanvasBackground />
                                <div className="relative z-10 lg:ml-64">
                                    <Routes>
                                        <Route
                                            path="/"
                                            element={<Dashboard />}
                                        />
                                        <Route
                                            path="/markets"
                                            element={<Markets />}
                                        />
                                        <Route
                                            path="/portfolio"
                                            element={<Portfolio />}
                                        />
                                        <Route
                                            path="/leaderboard"
                                            element={<Leaderboard />}
                                        />
                                        <Route
                                            path="/guilds"
                                            element={<Guilds />}
                                        />
                                    </Routes>
                                </div>
                                <Navbar />
                            </>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
