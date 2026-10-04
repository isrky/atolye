import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'bun run build && bunx wrangler d1 migrations apply isrky --local && bun run preview',
		port: 4173
	},
	testMatch: '**/*.e2e.{ts,js}'
});
