import { projeler, yazilar } from '#lib/server/icerik.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	sonYazilar: yazilar.slice(0, 3),
	oneCikanlar: projeler.filter((p) => p.oneCikan),
	yaziSayisi: yazilar.length,
	projeSayisi: projeler.length,
	sonTarih: yazilar[0]?.tarih ?? null
});
