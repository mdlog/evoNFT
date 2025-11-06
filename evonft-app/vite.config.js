import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3020,
        open: true,
        strictPort: true // Gagal jika port 3020 sudah digunakan
    }
})
