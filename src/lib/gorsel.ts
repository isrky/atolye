// R2'de duran yazı görselleri (gorsel.isrky.com) için adres üretimi.
// Özgün dosya kovada durur; küçük boyutları ve modern biçimleri Cloudflare istek anında üretir.
import kayitlar from '../content/gorseller.json';
import { site } from './site.ts';

export type GorselKaydi = { w: number; h: number };
export type GorselManifesti = Record<string, GorselKaydi>;

export type UzakGorsel = {
	src: string;
	srcset: string;
	sizes: string;
	width: number;
	height: number;
};

/** Okuma sütunu ~720px'i geçmez; dar ekranda görsel ekranı kaplar. */
const SIZES = '(min-width: 768px) 720px, 100vw';

/** Adres görsel sunucusundaysa kovadaki anahtarını verir (ör. zen/sabah/tepeler-1a2b3c4d.jpg). */
export function gorselAnahtari(src: unknown): string | null {
	const on = `${site.gorsel.adres}/`;
	if (typeof src !== 'string' || !src.startsWith(on)) return null;
	const anahtar = src.slice(on.length);
	return anahtar && !anahtar.startsWith('cdn-cgi/') ? anahtar : null;
}

/** Belirli genişlikte, tarayıcıya uygun biçimde (AVIF/WebP) sunulan adres. */
export function donusumAdresi(anahtar: string, genislik: number): string {
	// onerror=redirect: dönüşüm başarısız olursa (ör. aylık kota dolunca) özgün dosyaya düşer.
	return `${site.gorsel.adres}/cdn-cgi/image/width=${genislik},quality=80,format=auto,onerror=redirect/${anahtar}`;
}

/**
 * Kovadaki bir görsel için duyarlı <img> öznitelikleri. Başka adresler ve manifestte olmayan
 * anahtarlar için null döner; çağıran görseli olduğu gibi çizer.
 */
export function uzakGorsel(
	src: unknown,
	manifest: GorselManifesti = kayitlar as GorselManifesti
): UzakGorsel | null {
	const anahtar = gorselAnahtari(src);
	const kayit = anahtar ? manifest[anahtar] : undefined;
	if (!anahtar || !kayit) return null;

	// Özgünden büyük genişlik istenmez; özgün en büyük basamaktan küçükse kendi genişliği eklenir.
	const enBuyuk = Math.max(...site.gorsel.genislikler);
	const genislikler = [
		...new Set([...site.gorsel.genislikler.filter((g) => g < kayit.w), Math.min(kayit.w, enBuyuk)])
	];
	const varsayilan = genislikler.filter((g) => g <= 1280).at(-1) ?? genislikler[0];
	return {
		src: donusumAdresi(anahtar, varsayilan),
		srcset: genislikler.map((g) => `${donusumAdresi(anahtar, g)} ${g}w`).join(', '),
		sizes: SIZES,
		width: kayit.w,
		height: kayit.h
	};
}
