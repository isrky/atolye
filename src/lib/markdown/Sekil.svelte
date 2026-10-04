<script lang="ts">
	import type { Picture } from 'vite-imagetools';

	// Yazı klasöründeki görseller için: import kapak from './kapak.jpg?enhanced';
	let {
		src,
		alt,
		altyazi,
		genis = false
	}: { src: string | Picture; alt: string; altyazi?: string; genis?: boolean } = $props();
</script>

<figure class="not-prose my-10 {genis ? 'xl:-mx-24' : ''}">
	<enhanced:img
		{src}
		{alt}
		loading="lazy"
		class="h-auto w-full border-2 border-base-content bg-base-200 shadow-sert-lg"
	/>
	{#if altyazi}
		<figcaption class="mt-4 flex gap-2 font-mono text-xs text-base-content/75">
			<span aria-hidden="true">↳</span>{altyazi}
		</figcaption>
	{/if}
</figure>
