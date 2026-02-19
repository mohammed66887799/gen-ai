import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // This ensures that process.env.API_KEY is replaced with the environment variable 
    // from the Netlify build environment during the bundling process.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});