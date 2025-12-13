import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [basicSsl(), react()],
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
        },
        force: false,
    },
    build: {
        target: "esnext",
    },
    server: {
        headers: {
            "Cross-Origin-Opener-Policy": "same-origin",
            "Cross-Origin-Embedder-Policy": "require-corp",
        },
        hmr: {
            protocol: "wss",
        },
        strictPort: false,
        watch: {
            usePolling: false,
        },
    },
});
