import { error } from '@sveltejs/kit';
import { tumSeriler } from '#lib/server/icerik.ts';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => tumSeriler.map((s) => ({ seri: s.slug }));

export const load: PageServerLoad = ({ params }) => {
	const seri = tumSeriler.find((s) => s.slug === params.seri);
	if (!seri) error(404, `Defterde “${params.seri}” adında bir seri yok.`);
	return { seri, digerSeriler: tumSeriler.filter((s) => s.slug !== seri.slug) };
};
