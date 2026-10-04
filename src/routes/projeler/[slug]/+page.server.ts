import { error } from '@sveltejs/kit';
import { projeBul, projeler } from '#lib/server/icerik.ts';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => projeler.map((p) => ({ slug: p.slug }));

export const load: PageServerLoad = ({ params }) => {
	const proje = projeBul(params.slug);
	if (!proje) error(404, 'Bu parça rafta yok.');

	// Diğer parçalar: önce yığını en çok örtüşenler, eşitlikte raf sırası.
	const ortak = (yigin: string[]) => yigin.filter((y) => proje.yigin.includes(y)).length;
	const digerleri = projeler
		.filter((p) => p.slug !== proje.slug)
		.map((p, i) => ({ p, puan: ortak(p.yigin), i }))
		.sort((a, b) => b.puan - a.puan || a.i - b.i)
		.slice(0, 2)
		.map(({ p }) => p);

	return { proje, digerleri, toplam: projeler.length };
};
