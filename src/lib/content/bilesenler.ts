// Gövde bileşenleri tembel yüklenir; böylece her sayfa yalnızca kendi yazısını indirir.
import type { Component } from 'svelte';

type Mod = { default: Component };

const yaziBilesenleri = import.meta.glob<Mod>('/src/content/yazilar/*/index.md');
const projeBilesenleri = import.meta.glob<Mod>('/src/content/projeler/*/index.md');

/** `klasor`: 003-bu-tezgah-nasil-kuruldu */
export async function yaziBileseni(klasor: string) {
	const yukle = yaziBilesenleri[`/src/content/yazilar/${klasor}/index.md`];
	return yukle ? (await yukle()).default : undefined;
}

export async function projeBileseni(slug: string) {
	const yukle = projeBilesenleri[`/src/content/projeler/${slug}/index.md`];
	return yukle ? (await yukle()).default : undefined;
}
