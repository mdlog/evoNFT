import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        port: 3020,
        open: true,
        strictPort: true,
        allowedHosts: [
            'evonft.xyz',
            'www.evonft.xyz',
            '.evonft.xyz'
        ]
    }
})
