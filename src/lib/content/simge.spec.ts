import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// Site simgesi dosyaları depoda ve doğru boyutta mı?
// Başarısızsa: `bun run simge` çalıştırıp dosyaları depoya ekle.

/** PNG başlığından (IHDR) genişlik ve yükseklik. */
function boyut(b: Buffer) {
	expect(b.subarray(1, 4).toString()).toBe('PNG');
	return [b.readUInt32BE(16), b.readUInt32BE(20)];
}

describe('site simgesi', () => {
	it('favicon.svg kare bir viewBox taşır', () => {
		expect(readFileSync('static/favicon.svg', 'utf8')).toContain('viewBox="0 0 32 32"');
	});

	it('favicon.ico tek bir 32×32 PNG içerir', () => {
		const b = readFileSync('static/favicon.ico');
		expect([b.readUInt16LE(0), b.readUInt16LE(2), b.readUInt16LE(4)]).toEqual([0, 1, 1]);
		expect(boyut(b.subarray(b.readUInt32LE(18)))).toEqual([32, 32]);
	});

	it('apple-touch-icon.png 180×180', () => {
		expect(boyut(readFileSync('static/apple-touch-icon.png'))).toEqual([180, 180]);
	});
});
