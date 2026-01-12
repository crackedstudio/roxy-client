import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppProviders } from "./providers/AppProviders";

// WebAssembly fallback for instantiateStreaming
// This ensures WASM loads even if the server doesn't set the correct MIME type
// Based on working Linera project implementation
if (typeof WebAssembly !== "undefined") {
    const wasmAny = WebAssembly as any;
    const original = wasmAny.instantiateStreaming;
    if (typeof original === "function") {
        wasmAny.instantiateStreaming = async (source: any, importObject?: any) => {
            try {
                const res: Response = source instanceof Response ? source : await source;
                const ct = res.headers?.get("Content-Type") || "";
                if (ct.includes("application/wasm")) {
                    return original(Promise.resolve(res), importObject);
                }
                const buf = await res.arrayBuffer();
                return WebAssembly.instantiate(buf, importObject);
            } catch {
                const res: Response = source instanceof Response ? source : await source;
                const buf = await res.arrayBuffer();
                return WebAssembly.instantiate(buf, importObject);
            }
        };
    }
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AppProviders>
            <App />
        </AppProviders>
    </StrictMode>
);
