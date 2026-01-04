import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import path from "path";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";

// https://vite.dev/config/
export default defineConfig({
    // HTTPS is required for Cross-Origin Isolation (needed for Linera WASM SharedArrayBuffer)
    plugins: [
        basicSsl(), // Enable HTTPS for COEP/COOP headers
        react()
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    assetsInclude: ["**/*.wasm"],
    optimizeDeps: {
        exclude: ["@linera/client"],
        include: ["howler", "use-sound"],
        esbuildOptions: {
            target: "esnext",
            // Enable esbuild polyfill plugins for Dynamic SDK
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    process: true,
                }),
                NodeModulesPolyfillPlugin(),
            ],
        },
        force: false,
    },
    esbuild: {
        supported: {
            "top-level-await": true,
        },
    },
    build: {
        target: "esnext",
    },
    server: {
        headers: {
            "Cross-Origin-Opener-Policy": "same-origin",
            // COEP is required for SharedArrayBuffer (needed by Linera WASM)
            // Try credentialless first (less strict than require-corp)
            "Cross-Origin-Embedder-Policy": "credentialless",
            "Cross-Origin-Resource-Policy": "cross-origin",
        },
        hmr: {
            protocol: "wss", // Use WSS for HTTPS
        },
        strictPort: false,
        watch: {
            usePolling: false,
        },
        cors: true, // Enable CORS for development
        // Note: Dynamic Labs requires whitelisting localhost in their dashboard
        // The COEP header may cause CORS issues - if so, you must whitelist
        // https://localhost:5173 in Dynamic Labs dashboard at https://app.dynamic.xyz/
    },
});
