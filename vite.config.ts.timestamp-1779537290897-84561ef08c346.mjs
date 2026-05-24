// vite.config.ts
import { defineConfig, loadEnv } from "file:///C:/Users/sujay/Desktop/Care-and-connect/careandconnect_Dashboard/care-connect-hub-main/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/sujay/Desktop/Care-and-connect/careandconnect_Dashboard/care-connect-hub-main/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///C:/Users/sujay/Desktop/Care-and-connect/careandconnect_Dashboard/care-connect-hub-main/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\sujay\\Desktop\\Care-and-connect\\careandconnect_Dashboard\\care-connect-hub-main";
var vite_config_default = defineConfig(({ mode }) => {
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
        changeOrigin: true
      }
    ])
  );
  return {
    server: {
      host: "::",
      port: Number.isFinite(uiPort) ? uiPort : 5173,
      allowedHosts: true,
      hmr: {
        overlay: false
      },
      proxy
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src")
      },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"]
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxzdWpheVxcXFxEZXNrdG9wXFxcXENhcmUtYW5kLWNvbm5lY3RcXFxcY2FyZWFuZGNvbm5lY3RfRGFzaGJvYXJkXFxcXGNhcmUtY29ubmVjdC1odWItbWFpblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcc3VqYXlcXFxcRGVza3RvcFxcXFxDYXJlLWFuZC1jb25uZWN0XFxcXGNhcmVhbmRjb25uZWN0X0Rhc2hib2FyZFxcXFxjYXJlLWNvbm5lY3QtaHViLW1haW5cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3N1amF5L0Rlc2t0b3AvQ2FyZS1hbmQtY29ubmVjdC9jYXJlYW5kY29ubmVjdF9EYXNoYm9hcmQvY2FyZS1jb25uZWN0LWh1Yi1tYWluL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHsgY29tcG9uZW50VGFnZ2VyIH0gZnJvbSBcImxvdmFibGUtdGFnZ2VyXCI7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XHJcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCBcIlwiKTtcclxuICBjb25zdCBhcGlCYXNlID0gZW52LlZJVEVfQVBJX0JBU0VfVVJMID8/IFwiXCI7XHJcbiAgY29uc3QgcHJveHlUYXJnZXQgPSBlbnYuVklURV9ERVZfUFJPWFlfVEFSR0VUIHx8IFwiaHR0cDovL2xvY2FsaG9zdDo1MDAwXCI7XHJcbiAgY29uc3QgdWlQb3J0ID0gTnVtYmVyKGVudi5WSVRFX1BPUlQgfHwgNTE3Myk7XHJcbiAgY29uc3QgcHJveHlQcmVmaXhlcyA9IFtcIi9hdXRoXCIsIFwiL3VzZXJzXCIsIFwiL2ZpbGVzXCIsIFwiL2FwaVwiXTtcclxuICBpZiAoYXBpQmFzZS5zdGFydHNXaXRoKFwiL1wiKSAmJiAhcHJveHlQcmVmaXhlcy5pbmNsdWRlcyhhcGlCYXNlKSkge1xyXG4gICAgcHJveHlQcmVmaXhlcy5wdXNoKGFwaUJhc2UpO1xyXG4gIH1cclxuICBjb25zdCBwcm94eSA9IE9iamVjdC5mcm9tRW50cmllcyhcclxuICAgIHByb3h5UHJlZml4ZXMubWFwKChwcmVmaXgpID0+IFtcclxuICAgICAgcHJlZml4LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGFyZ2V0OiBwcm94eVRhcmdldCxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICBdKVxyXG4gICk7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgaG9zdDogXCI6OlwiLFxyXG4gICAgICBwb3J0OiBOdW1iZXIuaXNGaW5pdGUodWlQb3J0KSA/IHVpUG9ydCA6IDUxNzMsXHJcbiAgICAgIGFsbG93ZWRIb3N0czogdHJ1ZSxcclxuICAgICAgaG1yOiB7XHJcbiAgICAgICAgb3ZlcmxheTogZmFsc2UsXHJcbiAgICAgIH0sXHJcbiAgICAgIHByb3h5LFxyXG4gICAgfSxcclxuICAgIHBsdWdpbnM6IFtyZWFjdCgpLCBtb2RlID09PSBcImRldmVsb3BtZW50XCIgJiYgY29tcG9uZW50VGFnZ2VyKCldLmZpbHRlcihCb29sZWFuKSxcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgYWxpYXM6IHtcclxuICAgICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcclxuICAgICAgfSxcclxuICAgICAgZGVkdXBlOiBbXCJyZWFjdFwiLCBcInJlYWN0LWRvbVwiLCBcInJlYWN0L2pzeC1ydW50aW1lXCIsIFwicmVhY3QvanN4LWRldi1ydW50aW1lXCIsIFwiQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5XCIsIFwiQHRhbnN0YWNrL3F1ZXJ5LWNvcmVcIl0sXHJcbiAgICB9LFxyXG4gIH07XHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWtjLFNBQVMsY0FBYyxlQUFlO0FBQ3hlLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyx1QkFBdUI7QUFIaEMsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDeEMsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksR0FBRyxFQUFFO0FBQzNDLFFBQU0sVUFBVSxJQUFJLHFCQUFxQjtBQUN6QyxRQUFNLGNBQWMsSUFBSSx5QkFBeUI7QUFDakQsUUFBTSxTQUFTLE9BQU8sSUFBSSxhQUFhLElBQUk7QUFDM0MsUUFBTSxnQkFBZ0IsQ0FBQyxTQUFTLFVBQVUsVUFBVSxNQUFNO0FBQzFELE1BQUksUUFBUSxXQUFXLEdBQUcsS0FBSyxDQUFDLGNBQWMsU0FBUyxPQUFPLEdBQUc7QUFDL0Qsa0JBQWMsS0FBSyxPQUFPO0FBQUEsRUFDNUI7QUFDQSxRQUFNLFFBQVEsT0FBTztBQUFBLElBQ25CLGNBQWMsSUFBSSxDQUFDLFdBQVc7QUFBQSxNQUM1QjtBQUFBLE1BQ0E7QUFBQSxRQUNFLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxNQUNoQjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFFQSxTQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixNQUFNLE9BQU8sU0FBUyxNQUFNLElBQUksU0FBUztBQUFBLE1BQ3pDLGNBQWM7QUFBQSxNQUNkLEtBQUs7QUFBQSxRQUNILFNBQVM7QUFBQSxNQUNYO0FBQUEsTUFDQTtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxpQkFBaUIsZ0JBQWdCLENBQUMsRUFBRSxPQUFPLE9BQU87QUFBQSxJQUM5RSxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsTUFDdEM7QUFBQSxNQUNBLFFBQVEsQ0FBQyxTQUFTLGFBQWEscUJBQXFCLHlCQUF5Qix5QkFBeUIsc0JBQXNCO0FBQUEsSUFDOUg7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
