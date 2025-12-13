import type { PropsWithChildren } from "react";
import { useWallet } from "@/context/WalletContext";
import { ConnectWalletModal } from "@/components/modals/ConnectWalletModal";

export function AuthGate({ children }: PropsWithChildren) {
    const { isAuthenticated, isLineraReady } = useWallet();

    const allowAccess = isAuthenticated && isLineraReady;

    return (
        <>
            {!allowAccess && <ConnectWalletModal forceOpen />}
            <div aria-hidden={!allowAccess} className={!allowAccess ? "blur-sm" : ""}>
                {children}
            </div>
        </>
    );
}

