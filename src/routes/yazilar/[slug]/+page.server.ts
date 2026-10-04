import { error } from '@sveltejs/kit';
import { ilgili, slugify, tumSeriler, yaziBul, yazilar } from '#lib/server/icerik.ts';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => yazilar.map((y) => ({ slug: y.slug }));

export const load: PageServerLoad = ({ params }) => {
	const yazi = yaziBul(params.slug);
	if (!yazi) error(404, 'Bu numarada bir defter sayfası yok.');

	const seriKaydi = yazi.seri ? tumSeriler.find((s) => s.slug === yazi.seri!.slug) : undefined;
	const bolumler = (seriKaydi?.yazilar ?? []).map((y) => ({
		slug: y.slug,
		seriNo: y.seriNo,
		baslik: y.baslik,
		sira: y.seri!.sira
	}));
	const konum = bolumler.findIndex((b) => b.slug === yazi.slug);

	return {
		yazi,
		etiketler: yazi.etiketler.map((ad) => ({ ad, slug: slugify(ad) })),
		seri: seriKaydi ? { ad: seriKaydi.ad, slug: seriKaydi.slug, bolumler } : undefined,
		onceki: konum > 0 ? bolumler[konum - 1] : undefined,
		sonraki: konum >= 0 && konum < bolumler.length - 1 ? bolumler[konum + 1] : undefined,
		ilgili: ilgili(yazi)
	};
};
