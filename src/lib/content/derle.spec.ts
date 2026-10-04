import { describe, expect, it } from 'vitest';
import { etiketler, ilgiliYazilar, projeleriDerle, seriler, yazilariDerle } from './derle';
import { IcerikHatasi } from './sema';

const yazi = (slug: string, ek: Record<string, unknown> = {}) =>
	[
		`/src/content/yazilar/${slug}/index.md`,
		{ baslik: slug, ozet: 'özet', tarih: '2026-01-01T00:00:00.000Z', etiketler: [], ...ek }
	] as const;

describe('yazilariDerle', () => {
	const moduller = Object.fromEntries([
		yazi('eski', { tarih: '2026-01-01', etiketler: ['Svelte'] }),
		yazi('yeni', { tarih: '2026-03-01', etiketler: ['Svelte', 'D1'] }),
		yazi('orta', { tarih: '2026-02-01', etiketler: ['D1'] }),
		yazi('taslak', { tarih: '2026-04-01', taslak: true })
	]);

	it('en yeniyi başa koyar, seri numarasını yayın sırasına göre verir', () => {
		const l = yazilariDerle(moduller, false);
		expect(l.map((y) => y.slug)).toEqual(['yeni', 'orta', 'eski']);
		expect(l.map((y) => y.seriNo)).toEqual(['YZ-003', 'YZ-002', 'YZ-001']);
	});

	it('taslakları yalnızca istenirse gösterir', () => {
		expect(yazilariDerle(moduller, true).map((y) => y.slug)).toContain('taslak');
	});

	it('ISO zaman damgasını güne indirger', () => {
		expect(yazilariDerle(moduller, false).at(-1)?.tarih).toBe('2026-01-01');
	});

	it('etiketleri sayar ve ilgili yazıları ortak etikete göre sıralar', () => {
		const l = yazilariDerle(moduller, false);
		expect(etiketler(l)).toEqual([
			{ ad: 'D1', slug: 'd1', sayi: 2 },
			{ ad: 'Svelte', slug: 'svelte', sayi: 2 }
		]);
		const yeni = l.find((y) => y.slug === 'yeni')!;
		expect(ilgiliYazilar(yeni, l).map((y) => y.slug)).toEqual(['orta', 'eski']);
	});

	it('eksik alan için anlaşılır hata verir', () => {
		const [yol] = yazi('bozuk');
		expect(() => yazilariDerle({ [yol]: { ozet: 'x', tarih: '2026-01-01' } }, false)).toThrow(
			IcerikHatasi
		);
		expect(() =>
			yazilariDerle({ [yol]: { baslik: 'x', ozet: 'x', tarih: '01.01.2026' } }, false)
		).toThrow(/YYYY-AA-GG/);
	});
});

describe('seriler', () => {
	it('bölümleri sıraya koyar', () => {
		const l = yazilariDerle(
			Object.fromEntries([
				yazi('iki', { seri: { ad: 'Canlı sayaçlar', sira: 2 } }),
				yazi('bir', { seri: { ad: 'Canlı sayaçlar', sira: 1 } })
			]),
			false
		);
		const [s] = seriler(l);
		expect(s.slug).toBe('canli-sayaclar');
		expect(s.yazilar.map((y) => y.slug)).toEqual(['bir', 'iki']);
	});
});

describe('projeleriDerle', () => {
	const proje = (slug: string, yil: number, sira: number) => [
		`/src/content/projeler/${slug}/index.md`,
		{ baslik: slug, ozet: 'x', rol: 'x', yigin: ['Go'], yil, durum: 'yayinda', sira }
	];

	it('parça numarasını yıla, sırayı "sira" alanına göre verir', () => {
		const l = projeleriDerle(Object.fromEntries([proje('a', 2025, 2), proje('b', 2024, 1)]));
		expect(l.map((p) => [p.slug, p.parcaNo])).toEqual([
			['b', 'PRJ-001'],
			['a', 'PRJ-002']
		]);
	});

	it('geçersiz durumu reddeder', () => {
		const [yol, ham] = proje('c', 2024, 1) as [string, Record<string, unknown>];
		expect(() => projeleriDerle({ [yol]: { ...ham, durum: 'bitti' } })).toThrow(/durum/);
	});
});
