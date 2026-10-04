import { error } from '@sveltejs/kit';
import { etiketliYazilar, tumEtiketler } from '#lib/server/icerik.ts';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => tumEtiketler.map((e) => ({ etiket: e.slug }));

export const load: PageServerLoad = ({ params }) => {
	const etiket = tumEtiketler.find((e) => e.slug === params.etiket);
	if (!etiket) error(404, `Defterde #${params.etiket} etiketli bir sayfa yok.`);
	return { etiket, yazilar: etiketliYazilar(etiket.slug), etiketler: tumEtiketler };
};
