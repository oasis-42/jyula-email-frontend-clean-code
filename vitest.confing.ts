// jyula-email-frontend-clean-code/vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true, 
        setupFiles: './tests/setup.ts', 
        coverage: { 
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            lines: 50,
            functions: 50,
            branches: 50,
            statements: 50,
        },
    },
})