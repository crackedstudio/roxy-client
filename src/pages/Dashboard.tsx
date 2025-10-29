import { useGameStore } from "@/store/gameStore";
import { motion } from "framer-motion";
import {
    LuTrendingUp as TrendingUp,
    LuTrendingDown as TrendingDown,
    LuStar as Star,
    LuTrophy as Trophy,
    LuArrowRight as ArrowRight,
} from "react-icons/lu";
import { Link } from "react-router-dom";
import logo from "@/assets/roxy-logo.png";

export function Dashboard() {
    const {
        player,
        portfolioValue,
        totalProfit,
        totalProfitPercent,
        portfolio,
    } = useGameStore();

    const xpProgress = (player.xp % 1000) / 10; // XP progress for current level

    const recentBadges = player.badges.slice(-3); // Show last 3 badges

    return (
        <div className="min-h-screen bg-black text-white p-4 pb-20 lg:pb-4">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-8 max-w-7xl mx-auto border-b-2 border-accent pb-4">
                <div className="flex items-center gap-4">
                    <img
                        src={logo}
                        alt="Roxy Logo"
                        className="w-16 h-16 object-contain"
                    />
                    <div>
                        <h1 className="text-xl font-brutal text-text">
                            {player.name}
                        </h1>
                        <p className="text-sm font-mono-brutal text-text-body">
                            LEVEL {player.level}
                        </p>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-2xl font-brutal text-primary">
                        ${player.balance.toLocaleString()}
                    </p>
                    <p className="text-sm font-mono-brutal text-text-body">
                        BALANCE
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto space-y-6 lg:grid lg:grid-cols-12 lg:gap-6 lg:space-y-0">
                {/* Portfolio Value Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-brutal lg:col-span-8 border"
                >
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-brutal text-primary mb-2">
                            ${portfolioValue.toLocaleString()}
                        </h2>
                        <p className="font-mono-brutal text-white mb-4">
                            PORTFOLIO VALUE
                        </p>

                        <div className="flex items-center justify-center lg:justify-start gap-2">
                            {totalProfit >= 0 ? (
                                <TrendingUp
                                    className="text-success"
                                    size={20}
                                />
                            ) : (
                                <TrendingDown
                                    className="text-danger"
                                    size={20}
                                />
                            )}
                            <span
                                className={`text-lg font-brutal ${
                                    totalProfit >= 0
                                        ? "text-success"
                                        : "text-danger"
                                }`}
                            >
                                {totalProfit >= 0 ? "+" : ""}$
                                {totalProfit.toLocaleString()}(
                                {totalProfitPercent >= 0 ? "+" : ""}
                                {totalProfitPercent.toFixed(2)}%)
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* XP Progress Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card-brutal lg:col-span-4 border"
                >
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-brutal text-primary">
                            EXPERIENCE
                        </h3>
                        <span className="text-sm font-mono-brutal text-white">
                            {player.xp} XP
                        </span>
                    </div>

                    <div className="w-full bg-black border h-6">
                        <motion.div
                            className="bg-accent h-full border border-accent"
                            initial={{ width: 0 }}
                            animate={{ width: `${xpProgress}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                        />
                    </div>

                    <p className="text-sm font-mono-brutal text-white mt-2">
                        {1000 - (player.xp % 1000)} XP TO NEXT LEVEL
                    </p>
                </motion.div>

                {/* Badges Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card-brutal lg:col-span-6 border"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-brutal text-primary flex items-center gap-2">
                            <Trophy className="text-primary" size={20} />
                            RECENT BADGES
                        </h3>
                        <Link
                            to="/app/leaderboard"
                            className="text-accent hover:text-primary font-brutal transition-none"
                        >
                            VIEW ALL
                        </Link>
                    </div>

                    {recentBadges.length > 0 ? (
                        <div className="grid grid-cols-3 gap-4">
                            {recentBadges.map((badge, index) => (
                                <motion.div
                                    key={badge.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className="bg-primary p-3 text-center border-2 border-primary"
                                >
                                    <div className="text-2xl mb-1 font-brutal">
                                        {badge.icon}
                                    </div>
                                    <p className="text-xs font-brutal text-background">
                                        {badge.name}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-white">
                            <Star size={32} className="mx-auto mb-2" />
                            <p className="font-mono-brutal">
                                NO BADGES YET. START TRADING TO EARN YOUR FIRST
                                BADGE!
                            </p>
                        </div>
                    )}
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-2 gap-4 lg:col-span-6"
                >
                    <div className="card-brutal border">
                        <h4 className="text-sm font-mono-brutal text-white mb-1">
                            HOLDINGS
                        </h4>
                        <p className="text-xl font-brutal text-primary">
                            {portfolio.length}
                        </p>
                    </div>

                    <div className="card-brutal border">
                        <h4 className="text-sm font-mono-brutal text-white mb-1">
                            BEST PERFORMER
                        </h4>
                        <p className="text-xl font-brutal text-primary">
                            {portfolio.length > 0 ? "BTC" : "--"}
                        </p>
                    </div>
                </motion.div>

                {/* View Markets Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="pt-4 lg:col-span-12"
                >
                    <Link
                        to="/app/markets"
                        className="w-full lg:w-auto lg:inline-flex btn-brutal flex items-center justify-center gap-2"
                    >
                        VIEW MARKETS
                        <ArrowRight size={20} />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
