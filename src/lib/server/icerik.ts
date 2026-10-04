import { dev } from '$app/env';
import { slugify } from '#lib/content/slug.js';
import {
	etiketler,
	ilgiliYazilar,
	projeleriDerle,
	seriler,
	yazilariDerle
} from '#lib/content/derle.ts';
import type { Proje, Yazi } from '#lib/content/sema.ts';

export * from '#lib/content/sema.ts';
export { slugify };

const yaziMetalari = import.meta.glob<Record<string, unknown>>('/src/content/yazilar/*/index.md', {
	eager: true,
	import: 'metadata'
});
const projeMetalari = import.meta.glob<Record<string, unknown>>(
	'/src/content/projeler/*/index.md',
	{ eager: true, import: 'metadata' }
);

export const yazilar: Yazi[] = yazilariDerle(yaziMetalari, dev);
export const projeler: Proje[] = projeleriDerle(projeMetalari);
export const tumEtiketler = etiketler(yazilar);
export const tumSeriler = seriler(yazilar);

/** Adres parçasıyla (yz-003) yazı bulur. */
export const yaziBul = (kimlik: string) => yazilar.find((y) => y.kimlik === kimlik);
export const projeBul = (slug: string) => projeler.find((p) => p.slug === slug);
export const ilgili = (y: Yazi) => ilgiliYazilar(y, yazilar);
export const etiketliYazilar = (etiketSlug: string) =>
	yazilar.filter((y) => y.etiketler.some((e) => slugify(e) === etiketSlug));

/** Sayaç/damga API'sinin kabul ettiği anahtarlar: "yazi:<slug>" | "proje:<slug>". */
export const gecerliAnahtarlar = new Set([
	...yazilar.map((y) => `yazi:${y.slug}`),
	...projeler.map((p) => `proje:${p.slug}`)
]);
