import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// Her yazının paylaşım görselleri depoda ve doğru boyutta mı?
// Başarısızsa: `bun run paylasim` çalıştırıp görselleri depoya ekle.
const yazilar = readdirSync('src/content/yazilar').filter((slug) => {
	const dosya = `src/content/yazilar/${slug}/index.md`;
	return existsSync(dosya) && !/^taslak:\s*true/m.test(readFileSync(dosya, 'utf8'));
});
const manifest: Record<string, string> = JSON.parse(
	readFileSync('static/paylas/manifest.json', 'utf8')
);

/** PNG başlığından (IHDR) genişlik ve yükseklik. */
function boyut(dosya: string) {
	const b = readFileSync(dosya);
	expect(b.subarray(1, 4).toString()).toBe('PNG');
	return [b.readUInt32BE(16), b.readUInt32BE(20)];
}

describe('paylaşım görselleri', () => {
	it.each(yazilar)('%s için önizleme 1200×630, sosyal 1080×1440', (slug) => {
		expect(boyut(`static/paylas/yazilar/${slug}/embed.png`)).toEqual([1200, 630]);
		expect(boyut(`static/paylas/yazilar/${slug}/sosyal.png`)).toEqual([1080, 1440]);
		expect(manifest[slug], 'manifest kaydı yok: bun run paylasim').toBeTruthy();
	});

	it('varsayılan önizleme 1200×630', () => {
		expect(boyut('static/og/varsayilan.png')).toEqual([1200, 630]);
	});

	it('silinmiş yazıların görseli kalmamış', () => {
		expect(readdirSync('static/paylas/yazilar').sort()).toEqual([...yazilar].sort());
	});
});
