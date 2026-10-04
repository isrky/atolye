import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'bun run build && bunx wrangler d1 migrations apply isrky --local && bun run preview',
		port: 4173,
		// Derleme + paylaşım görseli kontrolü + workerd açılışı 60 sn’yi aşabiliyor.
		timeout: 180_000
	},
	testMatch: '**/*.e2e.{ts,js}'
});
