import type { PropsWithChildren } from "react";
import { LineraProvider } from "@/components/LineraProvider";
import { WalletProvider } from "@/context/WalletContext";

export function AppProviders({ children }: PropsWithChildren) {
    return (
        <LineraProvider>
            <WalletProvider>{children}</WalletProvider>
        </LineraProvider>
    );
}

