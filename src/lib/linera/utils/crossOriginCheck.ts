/**
 * Utility functions to check for cross-origin isolation and SharedArrayBuffer support
 * Required for Linera WASM threading functionality
 */

export interface CrossOriginStatus {
    isSupported: boolean;
    hasSharedArrayBuffer: boolean;
    isCrossOriginIsolated: boolean;
    hasCoepHeader: boolean;
    hasCoopHeader: boolean;
    errorMessage?: string;
}

/**
 * Check if SharedArrayBuffer is available
 */
export function hasSharedArrayBuffer(): boolean {
    try {
        return typeof SharedArrayBuffer !== "undefined";
    } catch {
        return false;
    }
}

/**
 * Check if cross-origin isolation is enabled
 */
export function isCrossOriginIsolated(): boolean {
    try {
        return (
            typeof self !== "undefined" &&
            (self as any).crossOriginIsolated === true
        );
    } catch {
        return false;
    }
}

/**
 * Check if COEP header is present (by checking if cross-origin isolation is enabled)
 */
export function hasCoepHeader(): boolean {
    return isCrossOriginIsolated();
}

/**
 * Check if COOP header is present (by checking if cross-origin isolation is enabled)
 */
export function hasCoopHeader(): boolean {
    return isCrossOriginIsolated();
}

/**
 * Get comprehensive cross-origin isolation status
 */
export function getCrossOriginStatus(): CrossOriginStatus {
    const hasSAB = hasSharedArrayBuffer();
    const isIsolated = isCrossOriginIsolated();

    let errorMessage: string | undefined;

    if (!hasSAB || !isIsolated) {
        if (!isIsolated) {
            errorMessage =
                "Cross-Origin Isolation is not enabled. The server must send the following headers:\n" +
                "- Cross-Origin-Opener-Policy: same-origin\n" +
                "- Cross-Origin-Embedder-Policy: credentialless (or require-corp)\n\n" +
                "These headers are required for Linera WASM to use SharedArrayBuffer for threading.";
        } else if (!hasSAB) {
            errorMessage =
                "SharedArrayBuffer is not available. This is required for Linera WASM threading.";
        }
    }

    return {
        isSupported: hasSAB && isIsolated,
        hasSharedArrayBuffer: hasSAB,
        isCrossOriginIsolated: isIsolated,
        hasCoepHeader: isIsolated,
        hasCoopHeader: isIsolated,
        errorMessage,
    };
}

/**
 * Validate cross-origin isolation before initializing WASM
 * Throws an error with helpful message if not supported
 */
export function validateCrossOriginIsolation(): void {
    const status = getCrossOriginStatus();

    if (!status.isSupported) {
        const error = new Error(
            status.errorMessage ||
                "Cross-Origin Isolation is not enabled. Please configure your server to send COEP/COOP headers."
        );
        (error as any).status = status;
        throw error;
    }
}

