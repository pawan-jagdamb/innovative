import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import 'dotenv/config'



// https://vitejs.dev/config/
export default defineConfig({
  server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',  // Replace with your backend server
      changeOrigin: true,
      secure: false,
    },
  },
},
  plugins: [react(),


  ],
})
