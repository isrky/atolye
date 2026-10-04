import { slugify } from './slug.js';

export type TocOgesi = { id: string; metin: string; seviye: number };

export type Yazi = {
	slug: string;
	seriNo: string; // YZ-001
	baslik: string;
	ozet: string;
	tarih: string;
	guncelleme?: string;
	etiketler: string[];
	seri?: { ad: string; slug: string; sira: number };
	taslak: boolean;
	ornek: boolean;
	okumaSuresi: number;
	toc: TocOgesi[];
};

export const PROJE_DURUMLARI = { yayinda: 'Yayında', devam: 'Sürüyor', arsiv: 'Arşivde' } as const;
export type ProjeDurumu = keyof typeof PROJE_DURUMLARI;

export type Proje = {
	slug: string;
	parcaNo: string; // PRJ-001
	baslik: string;
	ozet: string;
	rol: string;
	yigin: string[];
	yil: number;
	durum: ProjeDurumu;
	baglantilar: { kaynak?: string; canli?: string };
	oneCikan: boolean;
	sira: number;
	ornek: boolean;
	okumaSuresi: number;
	toc: TocOgesi[];
};

export class IcerikHatasi extends Error {}

type Ham = Record<string, unknown>;

function metin(ham: Ham, alan: string, dosya: string): string {
	const v = ham[alan];
	if (typeof v !== 'string' || !v.trim())
		throw new IcerikHatasi(`${dosya}: "${alan}" alanı zorunlu bir metin olmalı`);
	return v.trim();
}

function tarih(ham: Ham, alan: string, dosya: string, zorunlu = true): string | undefined {
	const v = ham[alan];
	if (v === undefined && !zorunlu) return undefined;
	// YAML tarihleri meta veride ISO zaman damgası olarak gelir.
	const s = (v instanceof Date ? v.toISOString() : String(v ?? '')).slice(0, 10);
	if (!/^\d{4}-\d{2}-\d{2}$/.test(s) || Number.isNaN(Date.parse(s)))
		throw new IcerikHatasi(`${dosya}: "${alan}" YYYY-AA-GG biçiminde olmalı`);
	return s;
}

function liste(ham: Ham, alan: string, dosya: string): string[] {
	const v = ham[alan] ?? [];
	if (!Array.isArray(v) || v.some((x) => typeof x !== 'string'))
		throw new IcerikHatasi(`${dosya}: "${alan}" bir metin listesi olmalı`);
	return v as string[];
}

export function slugDosyadan(yol: string) {
	const m = yol.match(/\/([^/]+)\/index\.(md|svx)$/);
	if (!m) throw new IcerikHatasi(`${yol}: içerik <slug>/index.md biçiminde olmalı`);
	return m[1];
}

export function yaziAyristir(yol: string, ham: Ham): Omit<Yazi, 'seriNo'> {
	const slug = slugDosyadan(yol);
	let seri: Yazi['seri'];
	if (ham.seri !== undefined) {
		const s = ham.seri as Ham;
		const ad = metin(s, 'ad', yol);
		const sira = Number(s.sira);
		if (!Number.isInteger(sira) || sira < 1)
			throw new IcerikHatasi(`${yol}: "seri.sira" pozitif bir tam sayı olmalı`);
		seri = { ad, slug: slugify(ad), sira };
	}
	return {
		slug,
		baslik: metin(ham, 'baslik', yol),
		ozet: metin(ham, 'ozet', yol),
		tarih: tarih(ham, 'tarih', yol)!,
		guncelleme: tarih(ham, 'guncelleme', yol, false),
		etiketler: liste(ham, 'etiketler', yol),
		seri,
		taslak: ham.taslak === true,
		ornek: ham.ornek === true,
		okumaSuresi: Number(ham.okumaSuresi ?? 1),
		toc: (ham.toc as TocOgesi[]) ?? []
	};
}

export function projeAyristir(yol: string, ham: Ham): Omit<Proje, 'parcaNo'> {
	const slug = slugDosyadan(yol);
	const durum = ham.durum as ProjeDurumu;
	if (!(durum in PROJE_DURUMLARI))
		throw new IcerikHatasi(
			`${yol}: "durum" şunlardan biri olmalı: ${Object.keys(PROJE_DURUMLARI).join(', ')}`
		);
	const yil = Number(ham.yil);
	if (!Number.isInteger(yil)) throw new IcerikHatasi(`${yol}: "yil" bir yıl olmalı`);
	const b = (ham.baglantilar ?? {}) as Ham;
	return {
		slug,
		baslik: metin(ham, 'baslik', yol),
		ozet: metin(ham, 'ozet', yol),
		rol: metin(ham, 'rol', yol),
		yigin: liste(ham, 'yigin', yol),
		yil,
		durum,
		baglantilar: {
			kaynak: typeof b.kaynak === 'string' ? b.kaynak : undefined,
			canli: typeof b.canli === 'string' ? b.canli : undefined
		},
		oneCikan: ham.one_cikan === true,
		sira: Number(ham.sira ?? 99),
		ornek: ham.ornek === true,
		okumaSuresi: Number(ham.okumaSuresi ?? 1),
		toc: (ham.toc as TocOgesi[]) ?? []
	};
}
