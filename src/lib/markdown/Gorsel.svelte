<script lang="ts">
	import type { HTMLImgAttributes } from 'svelte/elements';

	let { src, alt, title, ...rest }: HTMLImgAttributes = $props();
</script>

<figure class="not-prose my-8">
	<img
		{src}
		alt={alt ?? ''}
		{...rest}
		loading="lazy"
		decoding="async"
		class="h-auto w-full border-2 border-base-content bg-base-200 object-contain shadow-sert"
	/>
	{#if title}
		<figcaption class="mt-3 font-mono text-xs text-base-content/70">{title}</figcaption>
	{/if}
</figure>
