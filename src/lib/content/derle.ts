// Saf işlevler: ham meta verisinden sıralı, numaralı içerik listeleri üretir.
// Hem uygulama hem testler kullanır.
import { slugify } from './slug.js';
import { projeAyristir, yaziAyristir, type Proje, type Yazi } from './sema.ts';

type Modul = Record<string, Record<string, unknown>>;

const no = (onek: string, i: number) => `${onek}-${String(i).padStart(3, '0')}`;

export function yazilariDerle(moduller: Modul, taslaklariGoster: boolean): Yazi[] {
	const hepsi = Object.entries(moduller).map(([yol, ham]) => yaziAyristir(yol, ham));
	// Seri numarası yayın sırasına göre sabittir: en eski yazı YZ-001.
	return hepsi
		.filter((y) => taslaklariGoster || !y.taslak)
		.sort((a, b) => a.tarih.localeCompare(b.tarih) || a.slug.localeCompare(b.slug))
		.map((y, i) => ({ ...y, seriNo: no('YZ', i + 1) }))
		.reverse();
}

export function projeleriDerle(moduller: Modul): Proje[] {
	return Object.entries(moduller)
		.map(([yol, ham]) => projeAyristir(yol, ham))
		.sort((a, b) => a.yil - b.yil || a.slug.localeCompare(b.slug))
		.map((p, i) => ({ ...p, parcaNo: no('PRJ', i + 1) }))
		.sort((a, b) => a.sira - b.sira || b.yil - a.yil);
}

export function etiketler(yazilar: Yazi[]) {
	const sayac = new Map<string, { ad: string; slug: string; sayi: number }>();
	for (const y of yazilar)
		for (const ad of y.etiketler) {
			const slug = slugify(ad);
			const e = sayac.get(slug) ?? { ad, slug, sayi: 0 };
			e.sayi++;
			sayac.set(slug, e);
		}
	return [...sayac.values()].sort((a, b) => b.sayi - a.sayi || a.ad.localeCompare(b.ad, 'tr'));
}

export function seriler(yazilar: Yazi[]) {
	const m = new Map<string, { ad: string; slug: string; yazilar: Yazi[] }>();
	for (const y of yazilar) {
		if (!y.seri) continue;
		const s = m.get(y.seri.slug) ?? { ad: y.seri.ad, slug: y.seri.slug, yazilar: [] };
		s.yazilar.push(y);
		m.set(y.seri.slug, s);
	}
	for (const s of m.values()) s.yazilar.sort((a, b) => a.seri!.sira - b.seri!.sira);
	return [...m.values()];
}

/** Ortak etiket sayısına göre en ilgili yazılar (aynı seridekiler hariç). */
export function ilgiliYazilar(yazi: Yazi, yazilar: Yazi[], adet = 3) {
	const etiketKumesi = new Set(yazi.etiketler.map(slugify));
	return yazilar
		.filter((y) => y.slug !== yazi.slug && (!yazi.seri || y.seri?.slug !== yazi.seri.slug))
		.map((y) => ({ y, puan: y.etiketler.filter((e) => etiketKumesi.has(slugify(e))).length }))
		.filter((x) => x.puan > 0)
		.sort((a, b) => b.puan - a.puan || b.y.tarih.localeCompare(a.y.tarih))
		.slice(0, adet)
		.map((x) => x.y);
}
