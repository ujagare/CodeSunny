import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import preloadCSS from "./vite-plugin-preload-css.js";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    preloadCSS(),
    ViteImageOptimizer({
      png: {
        quality: 80,
      },
      jpeg: {
        quality: 80,
      },
      jpg: {
        quality: 80,
      },
      webp: {
        quality: 80,
      },
    }),
    VitePWA({
      disable: process.env.NODE_ENV === 'development',
      registerType: "autoUpdate",
      injectRegister: 'inline',
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      workbox: {
        globPatterns: [
          "**/*.{js,css,html,ico,png,svg,webp,woff,woff2,ttf,eot}",
        ],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallbackDenylist: [/^chrome-extension:\/\//],
        ignoreURLParametersMatching: [/.*/],
        runtimeCaching: [
          {
            urlPattern: ({ url, request }) => {
              return (
                (url.protocol === "http:" || url.protocol === "https:") &&
                !url.href.startsWith("chrome-extension://") &&
                !url.href.startsWith("chrome://")
              );
            },
            handler: "NetworkFirst",
            options: {
              cacheName: "http-cache",
              networkTimeoutSeconds: 10,
            },
          },
          {
            urlPattern: /^https:\/\/cuberto\.com\/.*\.(mp4|webm)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "video-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "unsplash-images",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "supabase-assets",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },
    }),
  ],
  server: {
    hmr: {
      overlay: true,
      protocol: 'ws',
      host: 'localhost',
    },
  },
  preview: {
    allowedHosts: ["codesunny.onrender.com"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
