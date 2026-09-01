import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    port: 5183,
    host: true,
<<<<<<< HEAD
=======
    hmr: {
      clientPort: 5173,
    },
>>>>>>> 9d38903e872714ab84df19b3829bd2415adc6673
  },
});

