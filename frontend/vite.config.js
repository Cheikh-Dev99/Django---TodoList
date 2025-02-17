import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  base: "/Django---TodoList/",
  server: {
    proxy: {
      "/api": {
        target: "https://django-todo-backend-50w9.onrender.com",
        changeOrigin: true,
      },
    },
  },
});
