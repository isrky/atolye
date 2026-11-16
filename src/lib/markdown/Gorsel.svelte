<script lang="ts">
	import { getContext } from 'svelte';
	import type { HTMLImgAttributes } from 'svelte/elements';
	import { uzakGorsel } from '#lib/gorsel.ts';
	import { GORSEL_SADE, isikkutusuAc } from './isikkutusu.svelte.ts';

	let { src, alt, title, ...rest }: HTMLImgAttributes = $props();

	// Zen yerleşimi sade görünümü ister; atölyede sert çerçeve ve ofset gölge kalır.
	const sade = getContext<boolean>(GORSEL_SADE) === true;
	// Kovadaki görseller (gorsel.isrky.com) ekrana uygun boyutta ve biçimde istenir.
	const uzak = $derived(uzakGorsel(src));
</script>

<figure class="not-prose my-8">
	<!-- Basınca ışık kutusunda büyür; betik yoksa görsel yine yerinde durur. -->
	<button
		type="button"
		class="block w-full cursor-zoom-in {sade ? 'rounded-box' : ''}"
		aria-label="Görseli büyüt{alt ? `: ${alt}` : ''}"
		onclick={(e) => isikkutusuAc(e.currentTarget.querySelector('img'), title)}
	>
		<img
			src={uzak?.src ?? src}
			srcset={uzak?.srcset}
			sizes={uzak?.sizes}
			width={uzak?.width}
			height={uzak?.height}
			alt={alt ?? ''}
			{...rest}
			loading="lazy"
			decoding="async"
			class="h-auto w-full bg-base-200 object-contain {sade
				? 'rounded-box'
				: 'border-2 border-base-content shadow-sert'}"
		/>
	</button>
	{#if title}
		<figcaption
			class="mt-3 {sade
				? 'text-sm text-base-content/70 italic'
				: 'font-mono text-xs text-base-content/70'}"
		>
			{title}
		</figcaption>
	{/if}
</figure>
