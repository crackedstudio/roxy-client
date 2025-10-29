import { useGameStore } from "@/store/gameStore";
import { motion } from "framer-motion";
import {
    LuTrendingUp as TrendingUp,
    LuTrendingDown as TrendingDown,
    LuArrowUp as ArrowUp,
    LuArrowDown as ArrowDown,
} from "react-icons/lu";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export function Portfolio() {
    const { portfolio, portfolioValue, totalProfit, totalProfitPercent } =
        useGameStore();

    // Mock data for portfolio growth chart
    const chartData = [
        { day: "Mon", value: 100000 },
        { day: "Tue", value: 102500 },
        { day: "Wed", value: 98000 },
        { day: "Thu", value: 105000 },
        { day: "Fri", value: 108000 },
        { day: "Sat", value: 110000 },
        { day: "Sun", value: portfolioValue },
    ];

    const formatPrice = (price: number) => {
        if (price < 1) {
            return `$${price.toFixed(4)}`;
        }
        return `$${price.toLocaleString(undefined, {
            maximumFractionDigits: 2,
        })}`;
    };

    const formatChange = (change: number) => {
        const sign = change >= 0 ? "+" : "";
        return `${sign}${change.toFixed(2)}%`;
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 pb-20 lg:pb-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-brutal text-primary mb-2">
                        PORTFOLIO
                    </h1>
                    <p className="font-mono-brutal text-white">
                        TRACK YOUR INVESTMENTS AND PERFORMANCE
                    </p>
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-6">
                    {/* Portfolio Summary */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card-brutal mb-6 lg:col-span-4"
                    >
                        <div className="text-center lg:text-left">
                            <h2 className="text-3xl font-brutal text-primary mb-2">
                                ${portfolioValue.toLocaleString()}
                            </h2>
                            <p className="font-mono-brutal text-white mb-4">
                                TOTAL PORTFOLIO VALUE
                            </p>

                            <div className="flex items-center justify-center lg:justify-start gap-2">
                                {totalProfit >= 0 ? (
                                    <TrendingUp
                                        className="text-primary"
                                        size={20}
                                    />
                                ) : (
                                    <TrendingDown
                                        className="text-accent"
                                        size={20}
                                    />
                                )}
                                <span
                                    className={`text-lg font-brutal ${
                                        totalProfit >= 0
                                            ? "text-primary"
                                            : "text-accent"
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

                    {/* Portfolio Growth Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card-brutal mb-6 lg:col-span-8"
                    >
                        <h3 className="text-lg font-brutal text-primary mb-4">
                            PORTFOLIO GROWTH (7 DAYS)
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#374151"
                                    />
                                    <XAxis dataKey="day" stroke="#9CA3AF" />
                                    <YAxis stroke="#9CA3AF" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#1F2937",
                                            border: "1px solid #374151",
                                            borderRadius: "8px",
                                            color: "#FFFFFF",
                                        }}
                                        formatter={(value: number) => [
                                            `$${value.toLocaleString()}`,
                                            "Value",
                                        ]}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#16A349"
                                        strokeWidth={2}
                                        dot={{
                                            fill: "#16A349",
                                            strokeWidth: 2,
                                            r: 4,
                                        }}
                                        activeDot={{ r: 6, fill: "#16A349" }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Holdings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card-brutal lg:col-span-12"
                    >
                        <h3 className="text-lg font-brutal text-primary mb-4">
                            YOUR HOLDINGS
                        </h3>

                        {portfolio.length > 0 ? (
                            <div className="space-y-4">
                                {portfolio.map((holding, index) => {
                                    const profit =
                                        (holding.currentPrice -
                                            holding.buyPrice) *
                                        holding.quantity;
                                    const profitPercent =
                                        ((holding.currentPrice -
                                            holding.buyPrice) /
                                            holding.buyPrice) *
                                        100;
                                    const currentValue =
                                        holding.currentPrice * holding.quantity;

                                    return (
                                        <motion.div
                                            key={holding.symbol}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className={`p-4 border transition-none ${
                                                profit > 0
                                                    ? "bg-success/10 border-success"
                                                    : "bg-danger/10 border-danger"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-primary border-brutal flex items-center justify-center text-lg font-brutal">
                                                        {holding.logo}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-brutal text-primary">
                                                            {holding.name}
                                                        </h4>
                                                        <p className="text-sm font-mono-brutal text-white">
                                                            {holding.symbol}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <p className="font-brutal text-lg text-white">
                                                        {formatPrice(
                                                            holding.currentPrice
                                                        )}
                                                    </p>
                                                    <div
                                                        className={`flex items-center gap-1 text-sm font-brutal ${
                                                            profit >= 0
                                                                ? "text-success"
                                                                : "text-danger"
                                                        }`}
                                                    >
                                                        {profit >= 0 ? (
                                                            <ArrowUp
                                                                size={14}
                                                            />
                                                        ) : (
                                                            <ArrowDown
                                                                size={14}
                                                            />
                                                        )}
                                                        {formatChange(
                                                            profitPercent
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <p className="font-mono-brutal text-white">
                                                        QUANTITY
                                                    </p>
                                                    <p className="font-brutal text-primary">
                                                        {holding.quantity.toFixed(
                                                            4
                                                        )}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="font-mono-brutal text-white">
                                                        BUY PRICE
                                                    </p>
                                                    <p className="font-brutal text-white">
                                                        {formatPrice(
                                                            holding.buyPrice
                                                        )}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="font-mono-brutal text-white">
                                                        VALUE
                                                    </p>
                                                    <p className="font-brutal text-primary">
                                                        {formatPrice(
                                                            currentValue
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-3 pt-3 border-t-brutal">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-mono-brutal text-white">
                                                        P&L
                                                    </span>
                                                    <span
                                                        className={`font-brutal ${
                                                            profit >= 0
                                                                ? "text-success"
                                                                : "text-danger"
                                                        }`}
                                                    >
                                                        {profit >= 0 ? "+" : ""}
                                                        $
                                                        {profit.toLocaleString(
                                                            undefined,
                                                            {
                                                                maximumFractionDigits: 2,
                                                            }
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-white">
                                <div className="mb-4 flex justify-center">
                                    <TrendingUp
                                        size={64}
                                        className="text-primary"
                                    />
                                </div>
                                <h3 className="text-lg font-brutal mb-2 text-primary">
                                    NO HOLDINGS YET
                                </h3>
                                <p className="font-mono-brutal">
                                    START TRADING TO BUILD YOUR PORTFOLIO!
                                </p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
