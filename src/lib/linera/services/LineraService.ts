import { lineraAdapter } from "../lib/linera-adapter";
import { PREDICTIVE_MANAGER_APP_ID } from "../constants";
import type {
    Player,
    PriceOutcome,
    PlayerQueryResponse,
    PlayerTotalPointsResponse,
    DailyOutcomeResponse,
    WeeklyOutcomeResponse,
    MonthlyOutcomeResponse,
    GlobalLeaderboardResponse,
    AllGuildsResponse,
    GuildMembersResponse,
    GuildTotalPointsResponse,
} from "../types";
import {
    GET_PLAYER_QUERY,
    GET_PLAYER_TOTAL_POINTS_QUERY,
    GET_DAILY_OUTCOME_QUERY,
    GET_WEEKLY_OUTCOME_QUERY,
    GET_MONTHLY_OUTCOME_QUERY,
    GET_GLOBAL_LEADERBOARD_QUERY,
    GET_ALL_GUILDS_QUERY,
    GET_GUILD_MEMBERS_QUERY,
    GET_GUILD_TOTAL_POINTS_QUERY,
    REGISTER_PLAYER_MUTATION,
    UPDATE_PROFILE_MUTATION,
    CLAIM_DAILY_REWARD_MUTATION,
    PREDICT_DAILY_OUTCOME_MUTATION,
    PREDICT_WEEKLY_OUTCOME_MUTATION,
    PREDICT_MONTHLY_OUTCOME_MUTATION,
} from "../queries";
import { amountToPoints } from "../utils/amount";

export class LineraService {
    private static instance: LineraService | null = null;
    private isInitialized: boolean = false;
    private chainId: string | null = null;

    private constructor() {}

    static getInstance(): LineraService {
        if (!LineraService.instance) {
            LineraService.instance = new LineraService();
        }
        return LineraService.instance;
    }

    private initializePromise: Promise<void> | null = null;

    /**
     * Initialize the service with a Dynamic wallet
     */
    async initialize(dynamicWallet: any): Promise<void> {
        if (this.isInitialized) {
            console.log("LineraService already initialized");
            return;
        }

        // If already initializing, return the existing promise
        if (this.initializePromise) {
            return this.initializePromise;
        }

        // Create the initialization promise
        this.initializePromise = (async () => {
            try {
                // Connect to Linera
                const provider = await lineraAdapter.connect(dynamicWallet);

                // Set application
                await lineraAdapter.setApplication(PREDICTIVE_MANAGER_APP_ID);

                // Get chain ID from provider
                const adapterChainId = provider.chainId;
                this.chainId = adapterChainId;

                this.isInitialized = true;
                console.log("LineraService initialized successfully");
            } catch (error) {
                console.error("Failed to initialize LineraService:", error);
                this.initializePromise = null; // Reset on error so it can retry
                throw error;
            } finally {
                this.initializePromise = null;
            }
        })();

        return this.initializePromise;
    }

    /**
     * Ensure service is initialized
     */
    async ensureInitialized(): Promise<void> {
        if (!this.isInitialized) {
            throw new Error(
                "LineraService not initialized. Call initialize() first."
            );
        }
    }

    // ===== Player Operations =====

    /**
     * Register a new player
     */
    async registerPlayer(displayName?: string): Promise<boolean> {
        await this.ensureInitialized();

        const query = {
            query: REGISTER_PLAYER_MUTATION,
            variables: {
                displayName: displayName || null,
            },
        };

        try {
            const result = await lineraAdapter.queryApplication<{
                registerPlayer: boolean;
            }>(query);

            return result.registerPlayer || false;
        } catch (error) {
            console.error("Failed to register player:", error);
            return false;
        }
    }

    /**
     * Update player profile
     */
    async updateProfile(displayName?: string): Promise<boolean> {
        await this.ensureInitialized();

        const query = {
            query: UPDATE_PROFILE_MUTATION,
            variables: {
                displayName: displayName || null,
            },
        };

        try {
            const result = await lineraAdapter.queryApplication<{
                updateProfile: boolean;
            }>(query);

            return result.updateProfile || false;
        } catch (error) {
            console.error("Failed to update profile:", error);
            return false;
        }
    }

    /**
     * Claim daily reward
     */
    async claimDailyReward(): Promise<boolean> {
        await this.ensureInitialized();

        const query = {
            query: CLAIM_DAILY_REWARD_MUTATION,
            variables: {},
        };

        try {
            const result = await lineraAdapter.queryApplication<{
                claimDailyReward: boolean;
            }>(query);

            return result.claimDailyReward || false;
        } catch (error) {
            console.error("Failed to claim daily reward:", error);
            return false;
        }
    }

    // ===== Prediction Operations =====

    /**
     * Make a daily price prediction
     */
    async predictDailyOutcome(outcome: PriceOutcome): Promise<boolean> {
        await this.ensureInitialized();

        const query = {
            query: PREDICT_DAILY_OUTCOME_MUTATION,
            variables: {
                outcome,
            },
        };

        try {
            const result = await lineraAdapter.queryApplication<{
                predictDailyOutcome: boolean;
            }>(query);

            return result.predictDailyOutcome || false;
        } catch (error) {
            console.error("Failed to predict daily outcome:", error);
            return false;
        }
    }

    /**
     * Make a weekly price prediction
     */
    async predictWeeklyOutcome(outcome: PriceOutcome): Promise<boolean> {
        await this.ensureInitialized();

        const query = {
            query: PREDICT_WEEKLY_OUTCOME_MUTATION,
            variables: {
                outcome,
            },
        };

        try {
            const result = await lineraAdapter.queryApplication<{
                predictWeeklyOutcome: boolean;
            }>(query);

            return result.predictWeeklyOutcome || false;
        } catch (error) {
            console.error("Failed to predict weekly outcome:", error);
            return false;
        }
    }

    /**
     * Make a monthly price prediction
     */
    async predictMonthlyOutcome(outcome: PriceOutcome): Promise<boolean> {
        await this.ensureInitialized();

        const query = {
            query: PREDICT_MONTHLY_OUTCOME_MUTATION,
            variables: {
                outcome,
            },
        };

        try {
            const result = await lineraAdapter.queryApplication<{
                predictMonthlyOutcome: boolean;
            }>(query);

            return result.predictMonthlyOutcome || false;
        } catch (error) {
            console.error("Failed to predict monthly outcome:", error);
            return false;
        }
    }

    // ===== Query Methods =====

    /**
     * Get player data
     */
    async getPlayer(playerId: string): Promise<Player | null> {
        await this.ensureInitialized();

        const query = {
            query: GET_PLAYER_QUERY,
            variables: { playerId },
        };

        try {
            const result =
                await lineraAdapter.queryApplication<PlayerQueryResponse>(
                    query
                );

            return result.player || null;
        } catch (error) {
            console.error("Failed to get player:", error);
            return null;
        }
    }

    /**
     * Get player total points
     */
    async getPlayerTotalPoints(playerId: string): Promise<number> {
        await this.ensureInitialized();

        const query = {
            query: GET_PLAYER_TOTAL_POINTS_QUERY,
            variables: { playerId },
        };

        try {
            const result =
                await lineraAdapter.queryApplication<PlayerTotalPointsResponse>(
                    query
                );

            const pointsString = result.playerTotalPoints;
            if (!pointsString) return 0;

            return amountToPoints(pointsString);
        } catch (error) {
            console.error("Failed to get player total points:", error);
            return 0;
        }
    }

    /**
     * Get daily prediction outcome (true if correct, false otherwise)
     */
    async getDailyOutcome(playerId: string): Promise<boolean | null> {
        await this.ensureInitialized();

        const query = {
            query: GET_DAILY_OUTCOME_QUERY,
            variables: { playerId },
        };

        try {
            const result =
                await lineraAdapter.queryApplication<DailyOutcomeResponse>(
                    query
                );

            return result.getDailyOutcome ?? null;
        } catch (error) {
            console.error("Failed to get daily outcome:", error);
            return null;
        }
    }

    /**
     * Get weekly prediction outcome
     */
    async getWeeklyOutcome(playerId: string): Promise<boolean | null> {
        await this.ensureInitialized();

        const query = {
            query: GET_WEEKLY_OUTCOME_QUERY,
            variables: { playerId },
        };

        try {
            const result =
                await lineraAdapter.queryApplication<WeeklyOutcomeResponse>(
                    query
                );

            return result.getWeeklyOutcome ?? null;
        } catch (error) {
            console.error("Failed to get weekly outcome:", error);
            return null;
        }
    }

    /**
     * Get monthly prediction outcome
     */
    async getMonthlyOutcome(playerId: string): Promise<boolean | null> {
        await this.ensureInitialized();

        const query = {
            query: GET_MONTHLY_OUTCOME_QUERY,
            variables: { playerId },
        };

        try {
            const result =
                await lineraAdapter.queryApplication<MonthlyOutcomeResponse>(
                    query
                );

            return result.getMonthlyOutcome ?? null;
        } catch (error) {
            console.error("Failed to get monthly outcome:", error);
            return null;
        }
    }

    /**
     * Get global leaderboard
     */
    async getGlobalLeaderboard(): Promise<
        GlobalLeaderboardResponse["globalLeaderboard"] | null
    > {
        await this.ensureInitialized();

        const query = {
            query: GET_GLOBAL_LEADERBOARD_QUERY,
            variables: {},
        };

        try {
            const result =
                await lineraAdapter.queryApplication<GlobalLeaderboardResponse>(
                    query
                );

            return result.globalLeaderboard || null;
        } catch (error) {
            console.error("Failed to get global leaderboard:", error);
            return null;
        }
    }

    /**
     * Get all guilds (for future use)
     */
    async getAllGuilds(): Promise<AllGuildsResponse["allGuilds"]> {
        await this.ensureInitialized();

        const query = {
            query: GET_ALL_GUILDS_QUERY,
            variables: {},
        };

        try {
            const result =
                await lineraAdapter.queryApplication<AllGuildsResponse>(query);

            return result.allGuilds || [];
        } catch (error) {
            console.error("Failed to get all guilds:", error);
            return [];
        }
    }

    /**
     * Get guild members (for future use)
     */
    async getGuildMembers(
        guildId: number
    ): Promise<GuildMembersResponse["guildMembers"]> {
        await this.ensureInitialized();

        const query = {
            query: GET_GUILD_MEMBERS_QUERY,
            variables: { guildId },
        };

        try {
            const result =
                await lineraAdapter.queryApplication<GuildMembersResponse>(
                    query
                );

            return result.guildMembers || [];
        } catch (error) {
            console.error("Failed to get guild members:", error);
            return [];
        }
    }

    /**
     * Get guild total points (for future use)
     */
    async getGuildTotalPoints(guildId: number): Promise<number> {
        await this.ensureInitialized();

        const query = {
            query: GET_GUILD_TOTAL_POINTS_QUERY,
            variables: { guildId },
        };

        try {
            const result =
                await lineraAdapter.queryApplication<GuildTotalPointsResponse>(
                    query
                );

            const pointsString = result.guildTotalPoints;
            if (!pointsString) return 0;

            return amountToPoints(pointsString);
        } catch (error) {
            console.error("Failed to get guild total points:", error);
            return 0;
        }
    }

    /**
     * Subscribe to notifications
     * Note: Block notifications are not yet implemented in LineraAdapter
     */
    onNotification(_callback: (data: any) => void): void {
        // TODO: Implement block notifications when LineraAdapter supports it
        console.warn("Block notifications not yet implemented");
    }

    /**
     * Get wallet information
     */
    getWalletInfo(): {
        chainId: string | null;
    } {
        return {
            chainId: this.chainId,
        };
    }

    /**
     * Disconnect from Linera
     */
    disconnect(): void {
        lineraAdapter.reset();
        this.isInitialized = false;
        this.chainId = null;
        console.log("LineraService disconnected");
    }
}
