import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";
import * as linera from "@linera/client";
import { PrivateKey } from "@linera/signer";
import { Wallet } from "ethers";

interface LineraContextType {
    client?: linera.Client;
    wallet?: linera.Wallet;
    chainId?: string;
    application?: linera.Application;
    accountOwner?: string;
    ready: boolean;
    error?: Error;
    reinitializeClient?: () => Promise<void>;
}

const LineraContext = createContext<LineraContextType>({ ready: false });

export const useLinera = () => useContext(LineraContext);

export function LineraProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<LineraContextType>({ ready: false });
    const initRef = useRef(false);
    const reinitCooldownRef = useRef<number>(0);

    const reinitializeClient = async () => {
        const now = Date.now();
        if (now - reinitCooldownRef.current < 5000) {
            // Throttle re-initialization attempts to every 5s
            return;
        }
        reinitCooldownRef.current = now;

        const doReinit = async (attempt = 0): Promise<void> => {
            try {
                // Re-init WASM module (best-effort)
                try {
                    await linera.default();
                } catch {}

                const faucetUrl = (import.meta as any).env
                    .VITE_LINERA_FAUCET_URL;
                const applicationId = (import.meta as any).env
                    .VITE_LINERA_APPLICATION_ID;

                if (!faucetUrl || !applicationId) {
                    throw new Error("Missing Linera env configuration");
                }

                const generated = Wallet.createRandom();
                const phrase = generated.mnemonic?.phrase;
                if (!phrase) throw new Error("Failed to generate mnemonic");

                localStorage.setItem("linera_mnemonic", phrase);

                const signer = PrivateKey.fromMnemonic(phrase);
                const faucet = new linera.Faucet(faucetUrl);
                const owner = signer.address();

                const wallet = await faucet.createWallet();
                const chainId = await faucet.claimChain(wallet, owner);

                const clientInstance = await new linera.Client(
                    wallet,
                    signer,
                    false
                );

                const application = await clientInstance
                    .frontend()
                    .application(applicationId);

                setState({
                    client: clientInstance,
                    wallet,
                    chainId,
                    application,
                    accountOwner: owner,
                    ready: true,
                    error: undefined,
                    reinitializeClient,
                });
            } catch (error) {
                const msg = String((error as any)?.message || error);
                // Retry once on characteristic WASM memory abort signatures
                if (
                    attempt === 0 &&
                    (msg.includes("RuntimeError") ||
                        msg.includes("unreachable") ||
                        msg.includes("malloc"))
                ) {
                    await new Promise((r) => setTimeout(r, 300));
                    return doReinit(1);
                }

                setState((prev) => ({
                    ...prev,
                    ready: false,
                    error: error as Error,
                }));
            }
        };

        return doReinit(0);
    };

    useEffect(() => {
        if (initRef.current) return;
        initRef.current = true;

        (async () => {
            try {
                // Initialize Linera WASM module
                await linera.default();

                // Get environment variables
                const faucetUrl = (import.meta as any).env
                    .VITE_LINERA_FAUCET_URL;
                const applicationId = (import.meta as any).env
                    .VITE_LINERA_APPLICATION_ID;

                if (!faucetUrl || !applicationId) {
                    throw new Error("Missing Linera env configuration");
                }

                // Get or generate mnemonic
                let mnemonic = localStorage.getItem("linera_mnemonic");
                if (!mnemonic) {
                    const generated = Wallet.createRandom();
                    const phrase = generated.mnemonic?.phrase;
                    if (!phrase) throw new Error("Failed to generate mnemonic");
                    mnemonic = phrase;
                    localStorage.setItem("linera_mnemonic", mnemonic);
                }

                // Create signer from mnemonic
                const signer = PrivateKey.fromMnemonic(mnemonic);
                const faucet = new linera.Faucet(faucetUrl);
                const owner = signer.address();

                // Create wallet and claim chain
                const wallet = await faucet.createWallet();
                const chainId = await faucet.claimChain(wallet, owner);

                // Initialize client and application
                const clientInstance = await new linera.Client(
                    wallet,
                    signer,
                    false
                );

                const application = await clientInstance
                    .frontend()
                    .application(applicationId);

                // Update state
                setState({
                    client: clientInstance,
                    wallet,
                    chainId,
                    application,
                    accountOwner: owner,
                    ready: true,
                    error: undefined,
                    reinitializeClient,
                });
            } catch (error) {
                setState({ ready: false, error: error as Error });
            }
        })();
    }, []);

    // Auto re-init on specific global WASM memory abort errors
    useEffect(() => {
        const errorHandler = (evt: ErrorEvent) => {
            const txt = String(evt.message || "");
            const filename = String(evt.filename || "");
            const stack = String(evt.error?.stack || "");
            
            // Check for WASM panics - can appear in message, filename, or stack
            const isWasmAbort =
                (txt.includes("linera_web_bg.wasm") || 
                 filename.includes("linera_web") ||
                 stack.includes("linera_web")) &&
                (txt.includes("RuntimeError") ||
                    txt.includes("unreachable") ||
                    txt.includes("malloc") ||
                    txt.includes("panicked") ||
                    txt.includes("Option::unwrap"));

            // Also catch panics that mention Linera WASM in stack trace
            const isLineraPanic = 
                (txt.includes("unreachable") && stack.includes("linera")) ||
                (txt.includes("RuntimeError") && stack.includes("linera")) ||
                (txt.includes("panicked") && (stack.includes("linera") || stack.includes("wasmer")));

            if (isWasmAbort || isLineraPanic) {
                console.warn("Linera WASM panic detected, reinitializing client...");
                // Fire-and-forget reinitialization
                reinitializeClient?.().catch(() => {});
            }
        };

        // Handle unhandled promise rejections from Linera client background sync
        // These are expected when offline or validator is unreachable
        const rejectionHandler = (evt: PromiseRejectionEvent) => {
            const reason = evt.reason;
            const msg = String(reason?.message || reason || "");
            const reasonStr = String(reason || "");
            
            // Suppress network errors from Linera client background tasks
            // These are expected when offline or validator is unreachable
            const isNetworkError = 
                msg.includes("ERR_INTERNET_DISCONNECTED") ||
                msg.includes("Failed to fetch") ||
                msg.includes("NetworkError") ||
                msg.includes("DownloadBlob") ||
                msg.includes("DownloadRawCertificatesByHeights") ||
                msg.includes("synchronize_chain_state");
            
            // Detect WASM panic errors that should trigger reinitialization
            const isWasmPanic = 
                msg.includes("unreachable") ||
                msg.includes("RuntimeError") ||
                msg.includes("panicked") ||
                msg.includes("Option::unwrap") ||
                reasonStr.includes("unreachable") ||
                reasonStr.includes("RuntimeError") ||
                reasonStr.includes("panicked");
            
            if (isNetworkError) {
                // Log as warning but don't show as unhandled error
                console.warn("Linera client background sync network error (expected when offline):", reason);
                evt.preventDefault(); // Prevent default unhandled rejection behavior
            } else if (isWasmPanic) {
                // WASM panics should trigger reinitialization
                console.warn("Linera WASM panic detected in promise rejection, reinitializing client...");
                evt.preventDefault(); // Prevent default unhandled rejection behavior
                // Trigger reinitialization
                reinitializeClient?.().catch(() => {});
            }
        };

        window.addEventListener("error", errorHandler);
        window.addEventListener("unhandledrejection", rejectionHandler);
        
        return () => {
            window.removeEventListener("error", errorHandler);
            window.removeEventListener("unhandledrejection", rejectionHandler);
        };
    }, []);

    return (
        <LineraContext.Provider value={state}>
            {children}
        </LineraContext.Provider>
    );
}

