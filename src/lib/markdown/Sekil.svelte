<script lang="ts">
	import { getContext } from 'svelte';
	import type { Picture } from 'vite-imagetools';
	import { uzakGorsel } from '#lib/gorsel.ts';
	import { GORSEL_SADE, isikkutusuAc } from './isikkutusu.svelte.ts';

	// Yazı klasöründeki görseller için: import kapak from './kapak.jpg?enhanced';
	// Kovadaki görseller için: src="https://gorsel.isrky.com/zen/…/ad-1a2b3c4d.jpg"
	let {
		src,
		alt,
		altyazi,
		genis = false
	}: { src: string | Picture; alt: string; altyazi?: string; genis?: boolean } = $props();

	// Zen yerleşimi sade görünümü ister; atölyede sert çerçeve ve ofset gölge kalır.
	const sade = getContext<boolean>(GORSEL_SADE) === true;
	const uzak = $derived(uzakGorsel(src));
	const sinif = $derived(
		`h-auto w-full bg-base-200 ${sade ? 'rounded-box' : 'border-2 border-base-content shadow-sert-lg'}`
	);
</script>

<figure class="not-prose my-10 {genis ? 'xl:-mx-24' : ''}">
	<!-- Basınca ışık kutusunda büyür; betik yoksa görsel yine yerinde durur. -->
	<button
		type="button"
		class="block w-full cursor-zoom-in {sade ? 'rounded-box' : ''}"
		aria-label="Görseli büyüt: {alt}"
		onclick={(e) => isikkutusuAc(e.currentTarget.querySelector('img'), altyazi)}
	>
		{#if uzak}
			<img {...uzak} {alt} loading="lazy" decoding="async" class={sinif} />
		{:else}
			<enhanced:img {src} {alt} loading="lazy" class={sinif} />
		{/if}
	</button>
	{#if altyazi}
		{#if sade}
			<figcaption class="mt-3 text-sm text-base-content/70 italic">{altyazi}</figcaption>
		{:else}
			<figcaption class="mt-4 flex gap-2 font-mono text-xs text-base-content/75">
				<span aria-hidden="true">↳</span>{altyazi}
			</figcaption>
		{/if}
	{/if}
</figure>
