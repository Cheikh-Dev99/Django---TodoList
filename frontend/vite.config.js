import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  base: "/Django---TodoList/",
  server: {
    proxy: {
      "/api": {
        target: "https://CheikhDev99.pythonanywhere.com",
        changeOrigin: true,
      },
    },
  },
});
