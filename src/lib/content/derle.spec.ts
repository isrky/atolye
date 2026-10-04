import { describe, expect, it } from 'vitest';
import { etiketler, ilgiliYazilar, projeleriDerle, seriler, yazilariDerle } from './derle';
import { IcerikHatasi } from './sema';

/** Klasör adı "NNN-ad" biçiminde: yazi('001-eski') → YZ-001, ad "eski". */
const yazi = (klasor: string, ek: Record<string, unknown> = {}) =>
	[
		`/src/content/yazilar/${klasor}/index.md`,
		{ baslik: klasor, ozet: 'özet', tarih: '2026-01-01T00:00:00.000Z', etiketler: [], ...ek }
	] as const;

describe('yazilariDerle', () => {
	const moduller = Object.fromEntries([
		yazi('001-eski', { tarih: '2026-01-01', etiketler: ['Svelte'] }),
		yazi('003-yeni', { tarih: '2026-03-01', etiketler: ['Svelte', 'D1'] }),
		yazi('002-orta', { tarih: '2026-02-01', etiketler: ['D1'] }),
		yazi('004-taslak', { tarih: '2026-04-01', taslak: true })
	]);

	it('en yeniyi başa koyar; numara, adres ve ad klasörden gelir', () => {
		const l = yazilariDerle(moduller, false);
		expect(l.map((y) => y.slug)).toEqual(['yeni', 'orta', 'eski']);
		expect(l.map((y) => y.seriNo)).toEqual(['YZ-003', 'YZ-002', 'YZ-001']);
		expect(l[0]).toMatchObject({
			no: 3,
			kimlik: 'yz-003',
			yol: '/yazilar/yz-003',
			klasor: '003-yeni'
		});
	});

	it('geriye tarihlenen yazı başkalarının numarasını değiştirmez', () => {
		const l = yazilariDerle(
			{ ...moduller, ...Object.fromEntries([yazi('005-geriye', { tarih: '2025-06-01' })]) },
			false
		);
		expect(l.map((y) => y.seriNo)).toEqual(['YZ-003', 'YZ-002', 'YZ-001', 'YZ-005']);
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

	it('numarasız ya da bozuk klasör adını reddeder', () => {
		for (const klasor of ['eski', '1-kisa', '007-Buyuk', '007-'])
			expect(() => yazilariDerle(Object.fromEntries([yazi(klasor)]), false)).toThrow(/NNN-kisa-ad/);
	});

	it('aynı numarayı ya da aynı adı iki kez kabul etmez (taslaklar dahil)', () => {
		expect(() =>
			yazilariDerle(Object.fromEntries([yazi('001-bir'), yazi('001-iki', { taslak: true })]), false)
		).toThrow(/YZ-001 iki kez/);
		expect(() =>
			yazilariDerle(Object.fromEntries([yazi('001-ayni'), yazi('002-ayni')]), false)
		).toThrow(/"ayni" adı iki yazıda/);
	});

	it('eksik alan için anlaşılır hata verir', () => {
		const [yol] = yazi('009-bozuk');
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
				yazi('002-iki', { seri: { ad: 'Canlı sayaçlar', sira: 2 } }),
				yazi('001-bir', { seri: { ad: 'Canlı sayaçlar', sira: 1 } })
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
