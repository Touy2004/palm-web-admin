import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    server: {
      // Add the allowedHosts array here to whitelist your domain
      allowedHosts: ['admin.phoudthasone.com'],
      proxy: {
        '/api': {
          target: 'https://api.phoudthasone.com',
          changeOrigin: true,
          secure: false,
        }
      }
    }
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  nitro: {
    preset: "bun",
    routeRules: {
      "/api/**": { proxy: "https://api.phoudthasone.com/api/**" }
    }
  }
});