// Gövde bileşenleri tembel yüklenir; böylece her sayfa yalnızca kendi yazısını indirir.
import type { Component } from 'svelte';

type Mod = { default: Component };

const yaziBilesenleri = import.meta.glob<Mod>('/src/content/yazilar/*/index.md');
const projeBilesenleri = import.meta.glob<Mod>('/src/content/projeler/*/index.md');

export async function yaziBileseni(slug: string) {
	const yukle = yaziBilesenleri[`/src/content/yazilar/${slug}/index.md`];
	return yukle ? (await yukle()).default : undefined;
}

export async function projeBileseni(slug: string) {
	const yukle = projeBilesenleri[`/src/content/projeler/${slug}/index.md`];
	return yukle ? (await yukle()).default : undefined;
}
