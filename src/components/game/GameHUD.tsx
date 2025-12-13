import { motion } from "framer-motion";
import { useMemo } from "react";
import { useGameStore } from "@/store/gameStore";

interface GameHUDProps {
    className?: string;
}

const containerVariants = {
    hidden: { opacity: 0, y: -12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function GameHUD({ className }: GameHUDProps) {
    const {
        player,
        portfolioValue,
        totalProfitPercent,
        xp,
        level,
        badges,
    } = useGameStore((state) => ({
        player: state.player,
        portfolioValue: state.portfolioValue,
        totalProfitPercent: state.totalProfitPercent,
        xp: state.xp ?? state.player.experiencePoints,
        level: state.level ?? state.player.level,
        badges: state.badges ?? state.player.achievementsEarned,
    }));

    const hudBadges = useMemo(
        () => badges?.slice(-4) ?? [],
        [badges]
    );

    const xpProgress =
        (xp ?? 0) % 1000 === 0
            ? 0
            : ((xp ?? 0) % 1000) / 10;

    return (
        <div
            className={className}
            style={{
                position: "fixed",
                inset: 0,
                pointerEvents: "none",
                zIndex: 20,
            }}
        >
            <motion.div
                className="pointer-events-auto m-4 flex flex-col gap-4 lg:m-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="grid gap-4 lg:grid-cols-2">
                    <motion.div
                        className="card-brutal-primary border-neon-primary p-4"
                        whileHover={{ scale: 1.01 }}
                    >
                        <p className="font-brutal text-sm text-accent">
                            PILOT
                        </p>
                        <h2 className="font-brutal text-2xl">
                            {player.displayName}
                        </h2>
                        <div className="mt-3 flex items-center gap-3">
                            <span className="border-neon-accent px-3 py-1 text-xs font-brutal">
                                LEVEL {level ?? player.level}
                            </span>
                            <span className="text-xs font-mono-brutal text-text-muted">
                                XP: {xp ?? player.experiencePoints}
                            </span>
                        </div>
                        <div className="mt-4 h-2 w-full border border-accent bg-black">
                            <div
                                className="h-full bg-accent transition-all duration-500"
                                style={{
                                    width: `${Math.min(Math.max(xpProgress, 0), 100)}%`,
                                }}
                            />
                        </div>
                    </motion.div>
                    <motion.div
                        className="card-brutal-primary border-neon-accent p-4"
                        whileHover={{ scale: 1.01 }}
                    >
                        <p className="font-brutal text-sm text-primary">
                            WALLET
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm font-mono-brutal">
                            <div>
                                <p className="text-text-muted">BALANCE</p>
                                <p className="text-xl font-brutal text-primary">
                                    {player.tokenBalance.toLocaleString()} pts
                                </p>
                            </div>
                            <div>
                                <p className="text-text-muted">
                                    PORTFOLIO VALUE
                                </p>
                                <p className="text-xl font-brutal text-primary">
                                    {portfolioValue.toLocaleString()} pts
                                </p>
                                <p
                                    className={`text-xs ${
                                        (totalProfitPercent ?? 0) >= 0
                                            ? "text-success"
                                            : "text-danger"
                                    }`}
                                >
                                    {(totalProfitPercent ?? 0).toFixed(2)}%
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                    <motion.div className="card-brutal border border-text">
                        <p className="font-brutal text-sm text-primary">
                            GUILD
                        </p>
                        <div className="mt-2 text-sm font-mono-brutal text-text-muted">
                            {player.guildId
                                ? `ID ${player.guildId}`
                                : "No guild"}
                        </div>
                        <div className="mt-3 flex gap-2">
                            {hudBadges.length === 0 ? (
                                <span className="text-xs text-text-muted">
                                    Unlock achievements to display badges.
                                </span>
                            ) : (
                                hudBadges.map((badge) => (
                                    <motion.span
                                        key={badge}
                                        whileHover={{ scale: 1.05 }}
                                        className="border-neon-accent px-2 py-1 text-xs font-brutal"
                                    >
                                        {badge}
                                    </motion.span>
                                ))
                            )}
                        </div>
                    </motion.div>
                    <motion.div className="card-brutal border border-text">
                        <p className="font-brutal text-sm text-accent">
                            QUICK ACTIONS
                        </p>
                        <div className="mt-3 grid grid-cols-3 gap-2 font-brutal text-xs">
                            {["Trade", "Portfolio", "Leaderboard"].map(
                                (label) => (
                                    <button
                                        key={label}
                                        className="border-neon-primary px-2 py-3 uppercase tracking-wide transition-none hover:opacity-90"
                                        type="button"
                                    >
                                        {label}
                                    </button>
                                )
                            )}
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}

export default GameHUD;


