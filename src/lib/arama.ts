export type AramaOgesi = {
	tur: 'yazi' | 'proje' | 'baglanti' | 'sayfa';
	baslik: string;
	aciklama: string;
	href: string;
	/** Aramaya katılan ek sözcükler (etiketler, yığın…). */
	ekler?: string;
};

/** Büyük/küçük harf ve Türkçe aksanlardan bağımsız karşılaştırma için sadeleştirir. */
export function sadelestir(s: string) {
	return s.toLocaleLowerCase('tr').replace(/ı/g, 'i').normalize('NFKD').replace(/[̀-ͯ]/g, '');
}

/** Her sözcük eşleşmeli; başlıkta geçenler öne çıkar. */
export function ara(ogeler: AramaOgesi[], sorgu: string) {
	const sozcukler = sadelestir(sorgu).split(/\s+/).filter(Boolean);
	if (!sozcukler.length) return ogeler;
	return ogeler
		.map((o) => {
			const baslik = sadelestir(o.baslik);
			const hepsi = `${baslik} ${sadelestir(o.aciklama)} ${sadelestir(o.ekler ?? '')}`;
			if (!sozcukler.every((s) => hepsi.includes(s))) return null;
			const puan = sozcukler.reduce(
				(p, s) => p + (baslik.startsWith(s) ? 3 : baslik.includes(s) ? 2 : 1),
				0
			);
			return { o, puan };
		})
		.filter((x) => x !== null)
		.sort((a, b) => b.puan - a.puan)
		.map((x) => x.o);
}
