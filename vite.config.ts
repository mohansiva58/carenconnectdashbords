import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiBase = env.VITE_API_BASE_URL ?? "";
  const proxyTarget = env.VITE_DEV_PROXY_TARGET || "http://localhost:5000";
  const uiPort = Number(env.VITE_PORT || 5173);
  const proxyPrefixes = ["/auth", "/users", "/files", "/api"];
  if (apiBase.startsWith("/") && !proxyPrefixes.includes(apiBase)) {
    proxyPrefixes.push(apiBase);
  }
  const proxy = Object.fromEntries(
    proxyPrefixes.map((prefix) => [
      prefix,
      {
        target: proxyTarget,
        changeOrigin: true,
      },
    ])
  );

  return {
    server: {
      host: "::",
      port: Number.isFinite(uiPort) ? uiPort : 5173,
      allowedHosts: true,
      hmr: {
        overlay: false,
      },
      proxy,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
    },
  };
});
