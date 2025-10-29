import { useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { motion } from "framer-motion";
import {
    LuUsers as Users,
    LuPlus as Plus,
    LuCrown as Crown,
    LuMessageCircle as MessageCircle,
    LuMapPin as MapPin,
} from "react-icons/lu";

export function Guilds() {
    const { availableGuilds, currentGuild, joinGuild } = useGameStore();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newGuildName, setNewGuildName] = useState("");
    const [newGuildDescription, setNewGuildDescription] = useState("");

    const handleJoinGuild = (guildId: string) => {
        joinGuild(guildId);
    };

    const handleCreateGuild = () => {
        if (newGuildName.trim() && newGuildDescription.trim()) {
            // In a real app, this would create a new guild
            console.log("Creating guild:", {
                name: newGuildName,
                description: newGuildDescription,
            });
            setShowCreateModal(false);
            setNewGuildName("");
            setNewGuildDescription("");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 pb-20 lg:pb-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-brutal text-primary mb-2">
                        GUILDS
                    </h1>
                    <p className="font-mono-brutal text-white">
                        JOIN FORCES WITH OTHER TRADERS
                    </p>
                </div>

                {/* Current Guild */}
                {currentGuild && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card-brutal-primary mb-6 border-primary"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-black border flex items-center justify-center text-xl">
                                    <Crown className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-brutal text-text">
                                        {currentGuild.name}
                                    </h3>
                                    <p className="text-sm font-mono-brutal text-text-body">
                                        {currentGuild.description}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-mono-brutal text-text-body">
                                    MEMBERS
                                </p>
                                <p className="text-lg font-brutal text-primary">
                                    {currentGuild.memberCount}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Guild Map Placeholder */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card-brutal mb-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <MapPin className="text-primary" size={20} />
                        <h3 className="text-lg font-brutal text-primary">
                            GUILD MAP
                        </h3>
                    </div>
                    <div className="h-32 bg-black border-brutal flex items-center justify-center text-white">
                        <div className="text-center">
                            <MapPin size={32} className="mx-auto mb-2" />
                            <p className="font-mono-brutal">
                                INTERACTIVE GUILD MAP COMING SOON
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Available Guilds */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card-brutal mb-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-brutal text-primary">
                            AVAILABLE GUILDS
                        </h3>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 px-4 py-2 btn-brutal"
                        >
                            <Plus size={16} />
                            CREATE GUILD
                        </button>
                    </div>

                    <div className="space-y-4">
                        {availableGuilds.map((guild, index) => (
                            <motion.div
                                key={guild.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-4 bg-black border-brutal hover:border-primary transition-none"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary border-brutal flex items-center justify-center text-lg font-brutal">
                                            <Users />
                                        </div>
                                        <div>
                                            <h4 className="font-brutal text-primary">
                                                {guild.name}
                                            </h4>
                                            <p className="text-sm font-mono-brutal text-white">
                                                {guild.description}
                                            </p>
                                            <div className="flex items-center gap-4 mt-1">
                                                <span className="text-xs font-mono-brutal text-white">
                                                    {guild.memberCount} MEMBERS
                                                </span>
                                                <span className="text-xs font-mono-brutal text-white">
                                                    $
                                                    {guild.totalValue.toLocaleString()}{" "}
                                                    TOTAL VALUE
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() =>
                                            handleJoinGuild(guild.id)
                                        }
                                        disabled={guild.isJoined}
                                        className={`px-4 py-2 border-brutal font-brutal transition-none ${
                                            guild.isJoined
                                                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                                                : "btn-brutal"
                                        }`}
                                    >
                                        {guild.isJoined ? "JOINED" : "JOIN"}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Guild Chat Placeholder */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card-brutal"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <MessageCircle className="text-primary" size={20} />
                        <h3 className="text-lg font-brutal text-primary">
                            GUILD CHAT
                        </h3>
                    </div>
                    <div className="h-32 bg-black border-brutal flex items-center justify-center text-white">
                        <div className="text-center">
                            <MessageCircle size={32} className="mx-auto mb-2" />
                            <p className="font-mono-brutal">
                                GUILD CHAT COMING SOON
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Create Guild Modal */}
                {showCreateModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowCreateModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="card-brutal w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-lg font-brutal text-primary mb-4">
                                CREATE NEW GUILD
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-brutal text-white mb-2">
                                        GUILD NAME
                                    </label>
                                    <input
                                        type="text"
                                        value={newGuildName}
                                        onChange={(e) =>
                                            setNewGuildName(e.target.value)
                                        }
                                        placeholder="ENTER GUILD NAME"
                                        className="w-full bg-black border-brutal px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary font-mono-brutal"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-brutal text-white mb-2">
                                        DESCRIPTION
                                    </label>
                                    <textarea
                                        value={newGuildDescription}
                                        onChange={(e) =>
                                            setNewGuildDescription(
                                                e.target.value
                                            )
                                        }
                                        placeholder="DESCRIBE YOUR GUILD"
                                        rows={3}
                                        className="w-full bg-black border-brutal px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary resize-none font-mono-brutal"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 py-3 px-4 bg-black text-white border-brutal font-brutal hover:bg-white hover:text-black transition-none"
                                >
                                    CANCEL
                                </button>
                                <button
                                    onClick={handleCreateGuild}
                                    className="flex-1 py-3 px-4 btn-brutal"
                                >
                                    CREATE GUILD
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
