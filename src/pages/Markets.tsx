import { useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { motion } from "framer-motion";
import { LuArrowUp as ArrowUp, LuArrowDown as ArrowDown } from "react-icons/lu";
import { BuySellModal } from "@/components/BuySellModal";

type SortOption = "all" | "gainers" | "losers";

export function Markets() {
    const { assets } = useGameStore();
    const [sortBy, setSortBy] = useState<SortOption>("all");
    const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

    const sortedAssets = assets.filter((asset) => {
        switch (sortBy) {
            case "gainers":
                return asset.change24h > 0;
            case "losers":
                return asset.change24h < 0;
            default:
                return true;
        }
    });

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
                        MARKETS
                    </h1>
                    <p className="font-mono-brutal text-white">
                        TRADE CRYPTO ASSETS AND BUILD YOUR PORTFOLIO
                    </p>
                </div>

                {/* Ticker */}
                <div className="mb-6 overflow-hidden">
                    <div className="flex animate-scroll whitespace-nowrap">
                        {assets.map((asset, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 mr-8 text-sm"
                            >
                                <span className="text-lg">{asset.logo}</span>
                                <span className="font-medium">
                                    {asset.symbol}
                                </span>
                                <span className="text-gray-400">
                                    {formatPrice(asset.price)}
                                </span>
                                <span
                                    className={
                                        asset.change24h >= 0
                                            ? "text-green-500"
                                            : "text-red-500"
                                    }
                                >
                                    {formatChange(asset.change24h)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sort Options */}
                <div className="flex gap-2 mb-6">
                    {[
                        { key: "all", label: "ALL" },
                        { key: "gainers", label: "TOP GAINERS" },
                        { key: "losers", label: "TOP LOSERS" },
                    ].map((option) => (
                        <button
                            key={option.key}
                            onClick={() => setSortBy(option.key as SortOption)}
                            className={`px-4 py-2 border-brutal font-brutal transition-none ${
                                sortBy === option.key
                                    ? "bg-primary text-black"
                                    : "bg-black text-white hover:bg-white hover:text-black"
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                {/* Asset Cards */}
                <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                    {sortedAssets.map((asset, index) => (
                        <motion.div
                            key={asset.symbol}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`card-brutal cursor-pointer transition-none ${
                                selectedAsset === asset.symbol
                                    ? "border-accent border-2"
                                    : "border hover:border-primary"
                            }`}
                            onClick={() => setSelectedAsset(asset.symbol)}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary border flex items-center justify-center text-lg font-brutal text-background">
                                        {asset.logo}
                                    </div>
                                    <div>
                                        <h3 className="font-brutal text-text">
                                            {asset.name}
                                        </h3>
                                        <p className="text-sm font-mono-brutal text-text-body">
                                            {asset.symbol}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="font-brutal text-lg text-white">
                                        {formatPrice(asset.price)}
                                    </p>
                                    <div
                                        className={`flex items-center gap-1 text-sm font-brutal ${
                                            asset.change24h >= 0
                                                ? "text-success"
                                                : "text-danger"
                                        }`}
                                    >
                                        {asset.change24h >= 0 ? (
                                            <ArrowUp size={14} />
                                        ) : (
                                            <ArrowDown size={14} />
                                        )}
                                        {formatChange(asset.change24h)}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedAsset(asset.symbol);
                                    }}
                                    className="flex-1 btn-brutal"
                                >
                                    BUY
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedAsset(asset.symbol);
                                    }}
                                    className="flex-1 btn-danger font-brutal py-2 px-4"
                                >
                                    SELL
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Buy/Sell Modal */}
                {selectedAsset && (
                    <BuySellModal
                        asset={assets.find((a) => a.symbol === selectedAsset)!}
                        onClose={() => setSelectedAsset(null)}
                    />
                )}
            </div>
        </div>
    );
}
