import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		// Expose development server
		host: '0.0.0.0',
		// Stick to port 3000 for dev
		port: 3000,
		// Fail startup if port 3000 is taken
		strictPort: true
	}
});
