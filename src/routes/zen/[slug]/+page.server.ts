import { error } from '@sveltejs/kit';
import { zenBul, zenYazilari } from '#lib/server/icerik.ts';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => zenYazilari.map((z) => ({ slug: z.slug }));

export const load: PageServerLoad = ({ params }) => {
	const yazi = zenBul(params.slug);
	if (!yazi) error(404, 'Bu adreste bir yazı yok.');

	// Liste en yeniden eskiye sıralı: bir önceki öğe daha yeni, bir sonraki daha eski.
	// Sabit yazılar bu zincirin dışındadır: ne kendileri komşu gösterir ne de komşu olarak görünür.
	const zincir = zenYazilari.filter((z) => !z.sabit);
	const konum = zincir.indexOf(yazi);
	const kisa = (z: (typeof zenYazilari)[number] | undefined) =>
		z ? { yol: z.yol, baslik: z.baslik } : undefined;

	return {
		yazi,
		dahaYeni: konum < 0 ? undefined : kisa(zincir[konum - 1]),
		dahaEski: konum < 0 ? undefined : kisa(zincir[konum + 1]),
		// scripts/paylasim.ts ile üretilir (static/paylas/zen/...).
		paylasim: {
			embed: `/paylas/zen/${yazi.slug}/embed.png`,
			sosyal: `/paylas/zen/${yazi.slug}/sosyal.png`,
			alt: yazi.baslik
		}
	};
};
