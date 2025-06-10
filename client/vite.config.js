import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ✅ No need for dotenv – Vite handles .env automatically

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // 👈 Optional: You can change this if needed
  },
});
