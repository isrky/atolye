import { zenYazilari } from '#lib/server/icerik.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	// Sabit yazılar yılların üstünde, bir kez görünür.
	const sabitler = zenYazilari.filter((z) => z.sabit);
	// Kalanı yıla göre grupla; liste zaten en yeniden eskiye sıralı.
	const yillar: { yil: string; yazilar: typeof zenYazilari }[] = [];
	for (const z of zenYazilari) {
		if (z.sabit) continue;
		const yil = z.tarih.slice(0, 4);
		const son = yillar.at(-1);
		if (son?.yil === yil) son.yazilar.push(z);
		else yillar.push({ yil, yazilar: [z] });
	}
	return {
		sabitler,
		yillar,
		// scripts/paylasim.ts ile üretilir.
		paylasim: { embed: '/og/zen.png', alt: 'Zen — kişisel yazılar' }
	};
};
