import { error } from '@sveltejs/kit';
import { projeBileseni } from '#lib/content/bilesenler.ts';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, data }) => {
	const Icerik = await projeBileseni(params.slug);
	if (!Icerik) error(404, 'Bu parçanın datasheet gövdesi bulunamadı.');
	return { ...data, Icerik };
};
