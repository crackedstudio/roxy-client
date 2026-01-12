import { useEffect, useState, useCallback, useRef } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { LineraService } from "../services/LineraService";
import { lineraAdapter } from "../lib/linera-adapter";

export function useAuth() {
    const { primaryWallet, setShowAuthFlow, user } = useDynamicContext();

    // Check if user is authenticated
    const isAuthenticated = !!user && !!primaryWallet;

    const [isLoading, setIsLoading] = useState(false);
    const [isConnectedToLinera, setIsConnectedToLinera] = useState(false);
    const [isAppConnected, setIsAppConnected] = useState(false);

    // Use ref to track initialization attempt to prevent redundant calls
    const initAttemptedRef = useRef<string | null>(null);
    const currentWalletAddress = primaryWallet?.address || null;

    // Initialize Linera connection when wallet is connected
    useEffect(() => {
        let cancelled = false;

        const initializeLinera = async () => {
            if (!primaryWallet || !user) {
                setIsConnectedToLinera(false);
                setIsAppConnected(false);
                initAttemptedRef.current = null;
                return;
            }

            // Check if already connected to avoid unnecessary re-initialization
            if (
                lineraAdapter.isChainConnected() &&
                lineraAdapter.isApplicationSet()
            ) {
                setIsConnectedToLinera(true);
                setIsAppConnected(true);
                initAttemptedRef.current = currentWalletAddress;
                return;
            }

            // Skip if we've already attempted initialization for this wallet
            if (initAttemptedRef.current === currentWalletAddress) {
                return;
            }

            // Mark that we're attempting initialization for this wallet
            initAttemptedRef.current = currentWalletAddress;

            setIsLoading(true);
            try {
                const service = LineraService.getInstance();
                await service.initialize(primaryWallet);

                // Check if effect was cancelled before updating state
                if (cancelled) {
                    return;
                }

                setIsConnectedToLinera(lineraAdapter.isChainConnected());
                setIsAppConnected(lineraAdapter.isApplicationSet());
            } catch (error) {
                console.error("Failed to initialize Linera:", error);

                // Check if it's a cross-origin isolation error
                const errorMessage =
                    error instanceof Error ? error.message : String(error);
                if (
                    errorMessage.includes("Cross-Origin Isolation") ||
                    errorMessage.includes("SharedArrayBuffer")
                ) {
                    console.error(
                        "⚠️ Linera WASM requires Cross-Origin Isolation headers.\n" +
                            "The server must send:\n" +
                            "- Cross-Origin-Opener-Policy: same-origin\n" +
                            "- Cross-Origin-Embedder-Policy: credentialless\n\n" +
                            "For Vercel deployments, ensure vercel.json is configured.\n" +
                            "For other platforms, configure headers in your hosting settings."
                    );
                }

                if (!cancelled) {
                    setIsConnectedToLinera(false);
                    setIsAppConnected(false);
                    // Reset the ref on error so initialization can be retried
                    if (initAttemptedRef.current === currentWalletAddress) {
                        initAttemptedRef.current = null;
                    }
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                    // Update connection state
                    const isConnected = lineraAdapter.isChainConnected();
                    const isAppSet = lineraAdapter.isApplicationSet();
                    setIsConnectedToLinera(isConnected);
                    setIsAppConnected(isAppSet);
                } else {
                    // If cancelled, reset the ref so initialization can be retried
                    if (initAttemptedRef.current === currentWalletAddress) {
                        initAttemptedRef.current = null;
                    }
                }
            }
        };

        initializeLinera();

        // Cleanup function to mark effect as cancelled
        return () => {
            cancelled = true;
        };
        // Use primaryWallet and user directly instead of isAuthenticated to avoid dependency issues
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [primaryWallet, user]);

    const showConnectWallet = useCallback(() => {
        setShowAuthFlow(true);
    }, [setShowAuthFlow]);

    const disconnect = useCallback(async () => {
        try {
            const service = LineraService.getInstance();
            service.disconnect();
            setIsConnectedToLinera(false);
            setIsAppConnected(false);
        } catch (error) {
            console.error("Failed to disconnect:", error);
        }
    }, []);

    const walletAddress = primaryWallet?.address || null;
    const chainId = lineraAdapter.getChainId();

    return {
        isLoading,
        isLoggedIn: isAuthenticated,
        isConnectedToLinera,
        isAppConnected,
        walletAddress,
        chainId,
        showConnectWallet,
        disconnect,
        primaryWallet,
        user,
    };
}
