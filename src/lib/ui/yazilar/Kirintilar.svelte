<script lang="ts">
	import { NotebookText } from '@lucide/svelte';

	// Defter › Etiketler › #x — son öğe bulunulan sayfadır, bağlantı değildir.
	let { yol }: { yol: { etiket: string; href?: string }[] } = $props();
</script>

<nav class="breadcrumbs font-mono text-xs sm:text-sm" aria-label="Sayfa konumu">
	<ul>
		<li>
			<a href="/yazilar" class="inline-flex items-center gap-1.5"
				><NotebookText class="size-4" aria-hidden="true" />Defter</a
			>
		</li>
		{#each yol as o, i (i)}
			<li>
				{#if o.href}
					<a href={o.href}>{o.etiket}</a>
				{:else}
					<span aria-current="page" class="font-bold">{o.etiket}</span>
				{/if}
			</li>
		{/each}
	</ul>
</nav>
