import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:3030", // Your backend port here
    },
    watch: {
      // Ignore only the two specific folders with images
      ignored: ["public/AllAET_PNG/**", "public/AllAET_JPG/**"], // Relative paths
    },
  },
});
