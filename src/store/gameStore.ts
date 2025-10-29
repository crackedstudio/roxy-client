import { create } from "zustand";

export interface Player {
    name: string;
    balance: number;
    xp: number;
    level: number;
    badges: Badge[];
    avatar: string;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedAt: Date;
}

export interface Asset {
    symbol: string;
    name: string;
    price: number;
    change24h: number;
    logo: string;
    marketCap: number;
}

export interface Holding {
    symbol: string;
    name: string;
    quantity: number;
    buyPrice: number;
    currentPrice: number;
    logo: string;
}

export interface LeaderboardEntry {
    id: string;
    username: string;
    avatar: string;
    portfolioValue: number;
    profitPercent: number;
    rankChange: number;
    isCurrentUser?: boolean;
}

export interface Guild {
    id: string;
    name: string;
    description: string;
    memberCount: number;
    totalValue: number;
    isJoined?: boolean;
}

interface GameState {
    // Player state
    player: Player;

    // Portfolio
    portfolio: Holding[];
    portfolioValue: number;
    totalProfit: number;
    totalProfitPercent: number;

    // Markets data
    assets: Asset[];

    // Leaderboard
    globalLeaderboard: LeaderboardEntry[];
    guildLeaderboard: LeaderboardEntry[];

    // Guild
    currentGuild: Guild | null;
    availableGuilds: Guild[];

    // UI state
    isLoading: boolean;
    error: string | null;
}

interface GameActions {
    // Asset actions
    buyAsset: (symbol: string, amount: number) => void;
    sellAsset: (symbol: string, amount: number) => void;
    updatePortfolioValues: () => void;

    // Player actions
    addXP: (points: number) => void;
    addBadge: (badge: Badge) => void;

    // Guild actions
    joinGuild: (guildId: string) => void;
    leaveGuild: () => void;

    // Data actions
    setAssets: (assets: Asset[]) => void;
    setLeaderboard: (
        global: LeaderboardEntry[],
        guild: LeaderboardEntry[]
    ) => void;
    setGuilds: (guilds: Guild[]) => void;

    // UI actions
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

const initialPlayer: Player = {
    name: "CryptoTrader",
    balance: 100000,
    xp: 0,
    level: 1,
    badges: [],
    avatar: "USER",
};

const mockAssets: Asset[] = [
    {
        symbol: "BTC",
        name: "Bitcoin",
        price: 45000,
        change24h: 2.5,
        logo: "₿",
        marketCap: 850000000000,
    },
    {
        symbol: "ETH",
        name: "Ethereum",
        price: 3200,
        change24h: -1.2,
        logo: "Ξ",
        marketCap: 385000000000,
    },
    {
        symbol: "DOGE",
        name: "Dogecoin",
        price: 0.08,
        change24h: 5.8,
        logo: "DOGE",
        marketCap: 12000000000,
    },
    {
        symbol: "ADA",
        name: "Cardano",
        price: 0.45,
        change24h: 3.2,
        logo: "₳",
        marketCap: 15000000000,
    },
    {
        symbol: "SOL",
        name: "Solana",
        price: 95,
        change24h: -2.1,
        logo: "◎",
        marketCap: 40000000000,
    },
];

const mockLeaderboard: LeaderboardEntry[] = [
    {
        id: "1",
        username: "CryptoKing",
        avatar: "KING",
        portfolioValue: 150000,
        profitPercent: 50.0,
        rankChange: 1,
    },
    {
        id: "2",
        username: "DiamondHands",
        avatar: "DIAMOND",
        portfolioValue: 125000,
        profitPercent: 25.0,
        rankChange: -1,
    },
    {
        id: "3",
        username: "CryptoTrader",
        avatar: "USER",
        portfolioValue: 100000,
        profitPercent: 0.0,
        rankChange: 0,
        isCurrentUser: true,
    },
];

const mockGuilds: Guild[] = [
    {
        id: "1",
        name: "Diamond Hands",
        description: "HODL strong, diamond hands only",
        memberCount: 150,
        totalValue: 2500000,
    },
    {
        id: "2",
        name: "DeFi Masters",
        description: "Decentralized finance experts",
        memberCount: 89,
        totalValue: 1800000,
    },
    {
        id: "3",
        name: "NFT Collectors",
        description: "Digital art and collectibles",
        memberCount: 200,
        totalValue: 3200000,
    },
];

export const useGameStore = create<GameState & GameActions>((set, get) => ({
    // Initial state
    player: initialPlayer,
    portfolio: [],
    portfolioValue: 100000,
    totalProfit: 0,
    totalProfitPercent: 0,
    assets: mockAssets,
    globalLeaderboard: mockLeaderboard,
    guildLeaderboard: [],
    currentGuild: null,
    availableGuilds: mockGuilds,
    isLoading: false,
    error: null,

    // Asset actions
    buyAsset: (symbol: string, amount: number) => {
        const state = get();
        const asset = state.assets.find((a) => a.symbol === symbol);
        if (!asset) return;

        const totalCost = asset.price * amount;
        if (totalCost > state.player.balance) return;

        const existingHolding = state.portfolio.find(
            (h) => h.symbol === symbol
        );

        if (existingHolding) {
            // Update existing holding
            const newQuantity = existingHolding.quantity + amount;
            const newBuyPrice =
                (existingHolding.buyPrice * existingHolding.quantity +
                    asset.price * amount) /
                newQuantity;

            set((state) => ({
                portfolio: state.portfolio.map((h) =>
                    h.symbol === symbol
                        ? {
                              ...h,
                              quantity: newQuantity,
                              buyPrice: newBuyPrice,
                              currentPrice: asset.price,
                          }
                        : h
                ),
                player: {
                    ...state.player,
                    balance: state.player.balance - totalCost,
                },
            }));
        } else {
            // Add new holding
            set((state) => ({
                portfolio: [
                    ...state.portfolio,
                    {
                        symbol,
                        name: asset.name,
                        quantity: amount,
                        buyPrice: asset.price,
                        currentPrice: asset.price,
                        logo: asset.logo,
                    },
                ],
                player: {
                    ...state.player,
                    balance: state.player.balance - totalCost,
                },
            }));
        }

        // Update portfolio values
        get().updatePortfolioValues();
    },

    sellAsset: (symbol: string, amount: number) => {
        const state = get();
        const holding = state.portfolio.find((h) => h.symbol === symbol);
        if (!holding || holding.quantity < amount) return;

        const asset = state.assets.find((a) => a.symbol === symbol);
        if (!asset) return;

        const totalValue = asset.price * amount;

        set((state) => ({
            portfolio: state.portfolio
                .map((h) =>
                    h.symbol === symbol
                        ? {
                              ...h,
                              quantity: h.quantity - amount,
                              currentPrice: asset.price,
                          }
                        : h
                )
                .filter((h) => h.quantity > 0),
            player: {
                ...state.player,
                balance: state.player.balance + totalValue,
            },
        }));

        // Update portfolio values
        get().updatePortfolioValues();
    },

    updatePortfolioValues: () => {
        const state = get();
        let totalValue = state.player.balance;
        let totalCost = 0;

        state.portfolio.forEach((holding) => {
            const holdingValue = holding.currentPrice * holding.quantity;
            const holdingCost = holding.buyPrice * holding.quantity;
            totalValue += holdingValue;
            totalCost += holdingCost;
        });

        const totalProfit = totalValue - 100000; // Initial balance was 100000
        const totalProfitPercent =
            totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0;

        set({
            portfolioValue: totalValue,
            totalProfit,
            totalProfitPercent,
        });
    },

    // Player actions
    addXP: (points: number) => {
        set((state) => {
            const newXP = state.player.xp + points;
            const newLevel = Math.floor(newXP / 1000) + 1;

            return {
                player: {
                    ...state.player,
                    xp: newXP,
                    level: newLevel,
                },
            };
        });
    },

    addBadge: (badge: Badge) => {
        set((state) => ({
            player: {
                ...state.player,
                badges: [...state.player.badges, badge],
            },
        }));
    },

    // Guild actions
    joinGuild: (guildId: string) => {
        const state = get();
        const guild = state.availableGuilds.find((g) => g.id === guildId);
        if (!guild) return;

        set({
            currentGuild: { ...guild, isJoined: true },
            availableGuilds: state.availableGuilds.map((g) =>
                g.id === guildId ? { ...g, isJoined: true } : g
            ),
        });
    },

    leaveGuild: () => {
        set((state) => ({
            currentGuild: null,
            availableGuilds: state.availableGuilds.map((g) => ({
                ...g,
                isJoined: false,
            })),
        }));
    },

    // Data actions
    setAssets: (assets: Asset[]) => set({ assets }),
    setLeaderboard: (global: LeaderboardEntry[], guild: LeaderboardEntry[]) =>
        set({ globalLeaderboard: global, guildLeaderboard: guild }),
    setGuilds: (guilds: Guild[]) => set({ availableGuilds: guilds }),

    // UI actions
    setLoading: (loading: boolean) => set({ isLoading: loading }),
    setError: (error: string | null) => set({ error }),
}));
