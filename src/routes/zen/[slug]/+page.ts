import { error } from '@sveltejs/kit';
import { zenBileseni } from '#lib/content/bilesenler.ts';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => {
	const Icerik = await zenBileseni(data.yazi.slug);
	if (!Icerik) error(404, 'Bu yazının gövdesi bulunamadı.');
	return { ...data, Icerik };
};
