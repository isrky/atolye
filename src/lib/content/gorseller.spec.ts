import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { gorselAnahtari } from '#lib/gorsel.ts';
import { site } from '#lib/site.ts';

// Yazılarda geçen her gorsel.isrky.com adresi yüklenmiş ve manifeste yazılmış mı?
// Başarısızsa: görseli `bun run gorsel <dosya> <yer>` ile yükle ya da adresi düzelt.
const manifest: Record<string, { w: number; h: number }> = JSON.parse(
	readFileSync('src/content/gorseller.json', 'utf8')
);

function mdDosyalari(klasor: string): string[] {
	return readdirSync(klasor, { withFileTypes: true }).flatMap((g) =>
		g.isDirectory()
			? mdDosyalari(join(klasor, g.name))
			: /\.(md|svx)$/.test(g.name)
				? [join(klasor, g.name)]
				: []
	);
}

const kacis = site.gorsel.adres.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const adresler = mdDosyalari('src/content').flatMap((dosya) =>
	[...readFileSync(dosya, 'utf8').matchAll(new RegExp(`${kacis}/[^\\s)"'<>}]+`, 'g'))].map((m) => ({
		dosya,
		adres: m[0]
	}))
);

describe('yazı görselleri', () => {
	it('yazılardaki her uzak görsel manifestte kayıtlı', () => {
		const eksik = adresler
			.filter(({ adres }) => {
				const anahtar = gorselAnahtari(adres);
				return !anahtar || !manifest[anahtar];
			})
			.map(({ dosya, adres }) => `${dosya}: ${adres}`);
		expect(eksik).toEqual([]);
	});

	it('manifestteki her kayıt geçerli bir anahtar ve boyut taşır', () => {
		const bozuk = Object.entries(manifest).filter(
			([anahtar, k]) =>
				!/^(zen|yazilar|projeler)\/[a-z0-9-]+\/[a-z0-9-]+-[0-9a-f]{8}\.(jpg|png)$/.test(anahtar) ||
				!(Number.isInteger(k.w) && k.w > 0 && Number.isInteger(k.h) && k.h > 0)
		);
		expect(bozuk).toEqual([]);
	});
});
