export interface DynamicConfig {
    lineraRpcUrl: string;
    lineraFaucetUrl: string;
    applicationId?: string;
}

const DEFAULT_LINERA_RPC = "https://rpc.testnet.linera.net/http";

export const dynamicConfig: DynamicConfig = {
    lineraRpcUrl: import.meta.env.VITE_LINERA_RPC_URL ?? DEFAULT_LINERA_RPC,
    lineraFaucetUrl:
        import.meta.env.VITE_LINERA_FAUCET_URL ??
        import.meta.env.VITE_LINERA_RPC_URL ??
        DEFAULT_LINERA_RPC,
    applicationId: import.meta.env.VITE_LINERA_APP_ID,
};

export const isDynamicConfigReady = () =>
    Boolean(dynamicConfig.lineraRpcUrl?.trim());
