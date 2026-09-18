import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
            react: fileURLToPath(new URL("./node_modules/react", import.meta.url)),
            "react-dom": fileURLToPath(new URL("./node_modules/react-dom", import.meta.url)),
        },
        dedupe: ["react", "react-dom"],
    },
    server: {
        port: 3000,
        proxy: {
            "/api": {
                target: process.env.VITE_API_PROXY_TARGET || "http://localhost:3001",
                changeOrigin: true,
            },
        },
    },
    build: {
        outDir: "build",
        sourcemap: false,
    },
});
