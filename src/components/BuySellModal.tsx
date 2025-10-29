import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LuX as X,
    LuTrendingUp as TrendingUp,
    LuTrendingDown as TrendingDown,
} from "react-icons/lu";
import { useGameStore } from "@/store/gameStore";
import type { Asset } from "@/store/gameStore";

interface BuySellModalProps {
    asset: Asset;
    onClose: () => void;
}

export function BuySellModal({ asset, onClose }: BuySellModalProps) {
    const [isBuying, setIsBuying] = useState(true);
    const [quantity, setQuantity] = useState("");
    const { player, buyAsset, sellAsset } = useGameStore();

    const numQuantity = parseFloat(quantity) || 0;
    const totalCost = numQuantity * asset.price;
    const canAfford = totalCost <= player.balance;

    const handleConfirm = () => {
        if (numQuantity <= 0) return;

        if (isBuying) {
            if (canAfford) {
                buyAsset(asset.symbol, numQuantity);
                onClose();
            }
        } else {
            // For selling, we'd need to check if user has enough holdings
            // This is simplified for now
            sellAsset(asset.symbol, numQuantity);
            onClose();
        }
    };

    const formatPrice = (price: number) => {
        if (price < 1) {
            return `$${price.toFixed(4)}`;
        }
        return `$${price.toLocaleString(undefined, {
            maximumFractionDigits: 2,
        })}`;
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/90 z-9999 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-card border-2 border-primary w-1/4 p-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary border-brutal flex items-center justify-center text-lg font-brutal">
                                {asset.logo}
                            </div>
                            <div>
                                <h3 className="font-brutal text-primary">
                                    {asset.name}
                                </h3>
                                <p className="text-sm font-mono-brutal text-white">
                                    {asset.symbol}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-accent transition-none font-brutal"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Buy/Sell Toggle */}
                    <div className="flex bg-black border-brutal p-1 mb-6">
                        <button
                            onClick={() => setIsBuying(true)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 border-brutal font-brutal transition-none ${
                                isBuying
                                    ? "bg-primary text-black"
                                    : "bg-black text-white hover:bg-white hover:text-black"
                            }`}
                        >
                            <TrendingUp size={16} />
                            BUY
                        </button>
                        <button
                            onClick={() => setIsBuying(false)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 border-brutal font-brutal transition-none ${
                                !isBuying
                                    ? "btn-danger"
                                    : "bg-black text-white hover:bg-white hover:text-black"
                            }`}
                        >
                            <TrendingDown size={16} />
                            SELL
                        </button>
                    </div>

                    {/* Price Display */}
                    <div className="text-center mb-6">
                        <p className="text-2xl font-brutal text-primary">
                            {formatPrice(asset.price)}
                        </p>
                        <p
                            className={`text-sm font-brutal ${
                                asset.change24h >= 0
                                    ? "text-success"
                                    : "text-danger"
                            }`}
                        >
                            {asset.change24h >= 0 ? "+" : ""}
                            {asset.change24h.toFixed(2)}% (24H)
                        </p>
                    </div>

                    {/* Quantity Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-brutal mb-2 text-white">
                            QUANTITY
                        </label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-black border-brutal px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary font-mono-brutal"
                            step="0.0001"
                            min="0"
                        />
                    </div>

                    {/* Total Cost */}
                    {numQuantity > 0 && (
                        <div className="bg-card border border-primary mb-6 p-4">
                            <div className="flex justify-between items-center">
                                <span className="font-mono-brutal text-white">
                                    TOTAL COST
                                </span>
                                <span className="font-brutal text-primary">
                                    {formatPrice(totalCost)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="font-mono-brutal text-white">
                                    BALANCE
                                </span>
                                <span className="font-brutal text-white">
                                    ${player.balance.toLocaleString()}
                                </span>
                            </div>
                            {isBuying && !canAfford && (
                                <p className="text-danger text-sm mt-2 font-brutal">
                                    INSUFFICIENT BALANCE
                                </p>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-4 bg-black text-white border-brutal font-brutal hover:bg-white hover:text-black transition-none"
                        >
                            CANCEL
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={
                                numQuantity <= 0 || (isBuying && !canAfford)
                            }
                            className={`flex-1 py-3 px-4 border-brutal font-brutal transition-none ${
                                isBuying
                                    ? "btn-brutal disabled:bg-gray-600 disabled:cursor-not-allowed"
                                    : "btn-danger disabled:bg-gray-600 disabled:cursor-not-allowed"
                            }`}
                        >
                            {isBuying ? "BUY" : "SELL"} {asset.symbol}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
