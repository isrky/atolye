// Işık kutusu: yazı içindeki bir görsele basınca onu ekranın izin verdiği kadar büyük gösterir.
// Durum modül düzeyindedir; Gorsel/Sekil açar, yerleşimdeki Isikkutusu.svelte gösterir.

export type AcikGorsel = {
	/** <picture> içindeki <source> öğeleri (enhanced:img için avif/webp). */
	kaynaklar: { type: string; srcset: string }[];
	src: string;
	srcset: string;
	/** Tarayıcı ekrana yetecek en büyük dosyayı seçsin; görsel kendi boyutundan öteye büyütülmez. */
	sizes?: string;
	alt: string;
	width?: number;
	height?: number;
	altyazi?: string;
};

/** Zen yerleşimi bu bağlam anahtarını true yapar; görseller sade görünümü seçer. */
export const GORSEL_SADE = 'gorsel-sade';

export const isikkutusu = $state<{ gorsel: AcikGorsel | null }>({ gorsel: null });

type Aday = { url: string; w: number; x: number };

function adaylar(srcset: string): Aday[] {
	return srcset
		.split(/,\s+/)
		.map((parca) => {
			const [url, tanim = '1x'] = parca.trim().split(/\s+/);
			const sayi = parseFloat(tanim) || 1;
			return tanim.endsWith('w') ? { url, w: sayi, x: 0 } : { url, w: 0, x: sayi };
		})
		.filter((a) => a.url);
}

/**
 * Yoğunluk tanımlı ("1x, 2x") srcset'i en büyük dosyaya indirger: tarayıcı 1x ekranda küçük dosyayı
 * seçer, oysa ışık kutusu görselin tamamını ister. Genişlik tanımlı ("800w") srcset olduğu gibi
 * kalır; onda seçimi `sizes` yönetir.
 */
function buyut(srcset: string): { srcset: string; enW: number; enX: number } {
	const l = adaylar(srcset);
	const enW = Math.max(0, ...l.map((a) => a.w));
	if (enW || !l.length) return { srcset, enW, enX: 1 };
	const en = l.reduce((a, b) => (b.x > a.x ? b : a));
	return { srcset: en.url, enW: 0, enX: en.x };
}

export function isikkutusuAc(img: HTMLImageElement | null, altyazi?: string | null) {
	if (!img) return;
	const kaynaklar = [...(img.closest('picture')?.querySelectorAll('source') ?? [])]
		.filter((s) => s.srcset)
		.map((s) => ({ type: s.type, ...buyut(s.srcset) }));
	const kendi = buyut(img.srcset);
	const enW = Math.max(kendi.enW, ...kaynaklar.map((k) => k.enW));
	// Tıklanan görselin doğal boyutu seçili adayın yoğunluğuna göre küçülmüştür; en büyüğe çevir.
	const oran =
		Math.max(kendi.enX, ...kaynaklar.map((k) => k.enX)) /
		(img.srcset && !kendi.enW ? devicePixelRatioAdayi(img) : 1);
	isikkutusu.gorsel = {
		kaynaklar: kaynaklar.map(({ type, srcset }) => ({ type, srcset })),
		src: img.srcset ? (kendi.enW ? img.currentSrc || img.src : kendi.srcset) : img.src,
		srcset: kendi.enW ? kendi.srcset : '',
		sizes: enW ? `min(100vw, ${enW}px)` : undefined,
		alt: img.alt,
		width: Math.round(img.naturalWidth * oran) || undefined,
		height: Math.round(img.naturalHeight * oran) || undefined,
		altyazi: altyazi || undefined
	};
}

/** Tarayıcının şu an gösterdiği adayın yoğunluğu (bulunamazsa 1). */
function devicePixelRatioAdayi(img: HTMLImageElement): number {
	const kaynak = [...(img.closest('picture')?.querySelectorAll('source') ?? [])]
		.map((s) => s.srcset)
		.concat(img.srcset)
		.flatMap(adaylar)
		.find((a) => a.x && new URL(a.url, location.href).href === img.currentSrc);
	return kaynak?.x ?? 1;
}

export function isikkutusuKapat() {
	isikkutusu.gorsel = null;
}
