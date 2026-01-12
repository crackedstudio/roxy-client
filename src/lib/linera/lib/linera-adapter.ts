import {
    initialize,
    Client,
    Faucet,
    Wallet,
    Application,
} from "@linera/client";
import type { Wallet as DynamicWallet } from "@dynamic-labs/sdk-react-core";
import { DynamicSigner } from "./dynamic-signer";
import { LINERA_RPC_URL } from "../constants";

export interface LineraProvider {
    client: Client;
    wallet: Wallet;
    faucet: Faucet;
    address: string;
    chainId: string;
}

export class LineraAdapter {
    private static instance: LineraAdapter | null = null;
    private provider: LineraProvider | null = null;
    private application: Application | null = null;
    private wasmInitPromise: Promise<unknown> | null = null;
    private connectPromise: Promise<LineraProvider> | null = null;
    private onConnectionChange?: () => void;

    private constructor() {}


    static getInstance(): LineraAdapter {
        if (!LineraAdapter.instance) {
            LineraAdapter.instance = new LineraAdapter();
        }
        return LineraAdapter.instance;
    }

    async connect(
        dynamicWallet: DynamicWallet,
        rpcUrl: string = LINERA_RPC_URL
    ): Promise<LineraProvider> {
        if (this.provider) return this.provider;
        if (this.connectPromise) return this.connectPromise;

        if (!dynamicWallet) {
            throw new Error("Dynamic wallet is required for Linera connection");
        }

        try {
        this.connectPromise = (async () => {
                const { address } = dynamicWallet;
                console.log("🔗 Connecting with Dynamic wallet:", address);

                try {
                    if (!this.wasmInitPromise) this.wasmInitPromise = initialize();
                    await this.wasmInitPromise;
                    console.log("✅ Linera WASM modules initialized successfully");
                } catch (e) {
                    const msg = e instanceof Error ? e.message : String(e);
                    if (msg.includes("storage is already initialized")) {
                        console.warn(
                            "⚠️ Linera storage already initialized; continuing without re-init"
                        );
                    } else {
                        throw e;
                    }
                }

                const faucet = new Faucet(rpcUrl);
                const wallet = await faucet.createWallet();
                const chainId = await faucet.claimChain(wallet, address);

                const signer = new DynamicSigner(dynamicWallet);
                
                // Client constructor may return a Promise - handle both cases
                let client: Client;
                const clientResult = new Client(wallet, signer, true); // true = skip_process_inbox
                if (clientResult && typeof (clientResult as any).then === "function") {
                    client = await clientResult;
                } else {
                    client = clientResult as Client;
                }
                
                console.log("✅ Linera wallet created successfully!");

                this.provider = {
                    client,
                    wallet,
                    faucet,
                    chainId,
                    address: dynamicWallet.address,
                };

                this.onConnectionChange?.();
                return this.provider;
            })();

            const provider = await this.connectPromise;
            return provider;
            } catch (error) {
                console.error("Failed to connect to Linera:", error);
            throw new Error(
                `Failed to connect to Linera network: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
            } finally {
                this.connectPromise = null;
            }
    }

    async setApplication(appId: string) {
        if (!this.provider) throw new Error("Not connected to Linera");
        if (!appId) throw new Error("Application ID is required");

        // In @linera/client 0.15.7, application() is directly on Client, not via frontend()
        const client = this.provider.client;
        const application = await client.application(appId);

        if (!application) throw new Error("Failed to get application");
        console.log("✅ Linera application set successfully!");
        this.application = application;
        this.onConnectionChange?.();
    }

    async queryApplication<T>(query: object): Promise<T> {
        if (!this.application) throw new Error("Application not set");

        const result = await this.application.query(JSON.stringify(query));
        const response = JSON.parse(result);

        console.log("✅ Linera application queried successfully!");
        return response as T;
    }

    getProvider(): LineraProvider {
        if (!this.provider) throw new Error("Provider not set");
        return this.provider;
    }

    getFaucet(): Faucet {
        if (!this.provider?.faucet) throw new Error("Faucet not set");
        return this.provider.faucet;
    }

    getWallet(): Wallet {
        if (!this.provider?.wallet) throw new Error("Wallet not set");
        return this.provider.wallet;
    }

    getApplication(): Application {
        if (!this.application) throw new Error("Application not set");
        return this.application;
    }

    getChainId(): string | null {
        return this.provider?.chainId || null;
    }

    isChainConnected(): boolean {
        return this.provider !== null;
    }

    isApplicationSet(): boolean {
        return this.application !== null;
    }

    onConnectionStateChange(callback: () => void): void {
        this.onConnectionChange = callback;
    }

    offConnectionStateChange(): void {
        this.onConnectionChange = undefined;
    }

    reset(): void {
        this.application = null;
        this.provider = null;
            this.connectPromise = null;
        this.onConnectionChange?.();
    }
}

// Export singleton instance
export const lineraAdapter = LineraAdapter.getInstance();

