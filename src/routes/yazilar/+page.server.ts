import { tumEtiketler, tumSeriler, yazilar } from '#lib/server/icerik.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	yazilar,
	etiketler: tumEtiketler,
	seriler: tumSeriler
});
