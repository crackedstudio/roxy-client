import * as linera from "@linera/client";
import { initialize } from "@linera/client";
// Note: This adapter is deprecated in favor of LineraProvider
// Keeping this file for backward compatibility but it's no longer actively used

import { PrivateKey } from "@linera/signer";
import { ethers } from "ethers";

// Type aliases for backward compatibility
type Application = linera.Application;
type Client = linera.Client;
type Faucet = linera.Faucet;
type Wallet = linera.Wallet;

export interface LineraProvider {
    client: Client;
    wallet: Wallet;
    faucet: Faucet;
    address: string;
    chainId: string;
    signer: PrivateKey;
    mnemonic: string;
    rpcUrl: string;
    faucetUrl: string;
}

export class LineraAdapter {
    private static instance: LineraAdapter | null = null;

    private provider: LineraProvider | null = null;
    private application: Application | null = null;
    private wasmInitPromise: Promise<unknown> | null = null;
    private connectPromise: Promise<LineraProvider> | null = null;
    private onConnectionChange?: () => void;

    private constructor() {}

    private async initWasm() {
        if (!this.wasmInitPromise) {
            this.wasmInitPromise = initialize();
        }
        try {
            await this.wasmInitPromise;
        } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            if (!msg.includes("storage is already initialized")) {
                throw error;
            }
        }
    }

    static getInstance(): LineraAdapter {
        if (!LineraAdapter.instance) {
            LineraAdapter.instance = new LineraAdapter();
        }
        return LineraAdapter.instance;
    }

    async connect(params: { rpcUrl: string; faucetUrl?: string }) {
        const { rpcUrl, faucetUrl = rpcUrl } = params;

        if (this.provider) return this.provider;
        if (this.connectPromise) return this.connectPromise;

        this.connectPromise = (async () => {
            await this.initWasm();
            const reachableRpcUrl = await this.ensureRpcReachable(rpcUrl);
            const faucet = await new linera.Faucet(faucetUrl);
            const mnemonic = ethers.Wallet.createRandom().mnemonic?.phrase;
            if (!mnemonic) {
                throw new Error("Failed to generate mnemonic for Linera wallet");
            }
            const signer = PrivateKey.fromMnemonic(mnemonic);
            const address = await signer.address();
            const wallet = await faucet.createWallet();
            const chainId = await faucet.claimChain(wallet, address);

            const client = await new linera.Client(wallet, signer, false);

            this.provider = {
                client,
                wallet,
                faucet,
                chainId,
                address,
                signer,
                mnemonic,
                rpcUrl: reachableRpcUrl,
                faucetUrl,
            };

            this.notifyConnectionChange();
            return this.provider;
        })();

        try {
            return await this.connectPromise;
        } finally {
            this.connectPromise = null;
        }
    }

    async setApplication(appId: string) {
        if (!this.provider) throw new Error("Linera provider not ready");
        const application = await this.provider.client.application(appId);
        if (!application) {
            throw new Error("Failed to obtain Linera application");
        }
        this.application = application;
        this.notifyConnectionChange();
    }

    async queryApplication<T>(query: object): Promise<T> {
        if (!this.application) throw new Error("Linera application not set");
        const result = await this.application.query(JSON.stringify(query));
        return JSON.parse(result) as T;
    }

    getProvider(): LineraProvider {
        if (!this.provider) throw new Error("Linera provider not ready");
        return this.provider;
    }

    getApplication(): Application {
        if (!this.application) throw new Error("Linera application not set");
        return this.application;
    }

    isChainConnected() {
        return this.provider !== null;
    }

    isApplicationSet() {
        return this.application !== null;
    }

    onConnectionStateChange(callback: () => void) {
        this.onConnectionChange = callback;
    }

    offConnectionStateChange() {
        this.onConnectionChange = undefined;
    }

    reset() {
        this.application = null;
        this.provider = null;
        this.connectPromise = null;
        this.notifyConnectionChange();
    }

    private notifyConnectionChange() {
        this.onConnectionChange?.();
    }

    private async ensureRpcReachable(rpcUrl: string): Promise<string> {
        if (typeof fetch === "undefined") return rpcUrl;

        try {
            const response = await fetch(rpcUrl, {
                method: "GET",
                mode: "no-cors",
                credentials: "omit",
                cache: "no-store",
            });
            if (!response.ok && response.type !== "opaque") {
                console.warn(
                    `[LineraAdapter] RPC responded with status ${response.status}`,
                    { url: rpcUrl }
                );
            }
            return rpcUrl;
        } catch (error) {
            const reason =
                error instanceof TypeError ? error.message : String(error);
            throw new Error(
                `Linera RPC endpoint is not reachable: ${rpcUrl}. Reason: ${reason}`
            );
        }
    }
}

export const lineraAdapter = LineraAdapter.getInstance();

