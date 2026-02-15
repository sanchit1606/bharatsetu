import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";
import { spawn } from "node:child_process";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: [".", "./client", "./shared"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: "dist/spa",
    // Increase chunk size warning limit and provide manual chunking for large vendor libs
    chunkSizeWarningLimit: 1200, // KB
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'recharts', 'framer-motion'],
          three: ['three', '@react-three/fiber', '@react-three/drei']
        }
      }
    }
  },
  plugins: [react(), expressPlugin(), openDevInChrome()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      const app = createServer();
      // Add Express app as middleware to Vite dev server
      server.middlewares.use(app);
    },
  };
}

function openDevInChrome(): Plugin {
  return {
    name: "open-dev-in-chrome",
    apply: "serve",
    configureServer(server) {
      const url = `http://localhost:${server.config.server.port ?? 8080}/`;

      let opened = false;
      server.httpServer?.once("listening", () => {
        if (opened) return;
        opened = true;

        // Small delay so the browser hits a live server reliably.
        setTimeout(() => {
          // Windows: start chrome <url>
          if (process.platform === "win32") {
            const child = spawn(
              "cmd",
              ["/c", "start", "", "chrome", url],
              { stdio: "ignore", windowsHide: true }
            );
            child.on("error", () => {
              // Fallback: open default browser if Chrome isn't found
              spawn("cmd", ["/c", "start", "", url], {
                stdio: "ignore",
                windowsHide: true,
              });
            });
            return;
          }

          // macOS: open -a "Google Chrome" <url>
          if (process.platform === "darwin") {
            const child = spawn("open", ["-a", "Google Chrome", url], {
              stdio: "ignore",
            });
            child.on("error", () => spawn("open", [url], { stdio: "ignore" }));
            return;
          }

          // Linux: try google-chrome, else xdg-open
          const child = spawn("google-chrome", [url], { stdio: "ignore" });
          child.on("error", () =>
            spawn("xdg-open", [url], { stdio: "ignore" })
          );
        }, 250);
      });
    },
  };
}
