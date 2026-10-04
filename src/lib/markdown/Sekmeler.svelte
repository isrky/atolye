<script lang="ts">
	import type { Snippet } from 'svelte';

	// Çok dosyalı kod örnekleri: her sekme bir snippet (Svelte 5 snippet'leri .md içinde de çalışır).
	let { sekmeler }: { sekmeler: { ad: string; icerik: Snippet }[] } = $props();
	const uid = $props.id();
	const grup = `sekme-${uid}`;
</script>

<div class="not-prose tabs tabs-lift my-8">
	{#each sekmeler as s, i (s.ad)}
		<input
			type="radio"
			name={grup}
			class="tab font-mono text-xs"
			aria-label={s.ad}
			checked={i === 0}
		/>
		<div class="tab-content border-base-content bg-base-100 p-0 [&_.kod]:my-0 [&_.kod]:shadow-none">
			{@render s.icerik()}
		</div>
	{/each}
</div>
