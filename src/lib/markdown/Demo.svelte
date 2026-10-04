<script lang="ts">
	import type { Snippet } from 'svelte';
	import { FlaskConical } from '@lucide/svelte';

	// Yazı içinde çalışan canlı Svelte bileşenleri için deney masası.
	let { baslik, children }: { baslik: string; children: Snippet } = $props();
</script>

<section
	class="not-prose my-10 border-2 border-base-content bg-base-100 shadow-sert-lg"
	aria-label="Canlı demo: {baslik}"
>
	<header
		class="flex flex-wrap items-center justify-between gap-2 border-b-2 border-base-content bg-accent px-4 py-2 text-accent-content"
	>
		<span class="flex items-center gap-2 font-mono text-xs font-bold tracking-wider uppercase">
			<FlaskConical class="size-4" aria-hidden="true" />
			{baslik}
		</span>
		<span class="badge border-accent-content bg-transparent font-mono badge-sm text-accent-content">
			<span class="status status-success" aria-hidden="true"></span> canlı
		</span>
	</header>
	<div
		class="bg-[linear-gradient(to_right,color-mix(in_oklch,var(--color-base-content)_8%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--color-base-content)_8%,transparent)_1px,transparent_1px)] bg-size-[16px_16px] p-6"
	>
		{@render children()}
	</div>
</section>
