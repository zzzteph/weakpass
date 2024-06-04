import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'index.js'),
            fileName: (format) => `cracker-lib.js`,
            formats: ['es']
        },
        rollupOptions: {
            external: [],
        }
    },
    resolve: {
    }
});
