import { error } from '@sveltejs/kit';
import { yaziBileseni } from '#lib/content/bilesenler.ts';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => {
	const Icerik = await yaziBileseni(data.yazi.klasor);
	if (!Icerik) error(404, 'Bu defter sayfasının gövdesi bulunamadı.');
	return { ...data, Icerik };
};
