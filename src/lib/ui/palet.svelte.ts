// Komut paletini sayfalardan açmak için: import { paletiAc } from '#lib/ui/palet.svelte.ts';
let acici: (() => void) | undefined;

export function paletKaydet(fn: () => void) {
	acici = fn;
}

export function paletiAc() {
	acici?.();
}
