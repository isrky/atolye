<script lang="ts">
	import type { Snippet } from 'svelte';

	// Kenar notu: geniş ekranda metin sütununun sağ boşluğunda (Duzen.svelte `relative`),
	// dar ekranda işarete dokununca açılan satır içi not.
	let { no, children }: { no: number | string; children: Snippet } = $props();
	const id = $props.id();
</script>

<label
	for="dipnot-{id}"
	class="cursor-pointer align-super font-mono text-xs font-bold text-accent"
	aria-label="Kenar notu {no}">[{no}]</label
><input type="checkbox" id="dipnot-{id}" class="peer sr-only" /><span
	class="my-3 hidden border-l-4 border-accent bg-base-200 p-3 text-sm leading-snug peer-checked:block xl:absolute xl:-right-72 xl:my-0 xl:block xl:w-60 xl:border-l-2 xl:bg-transparent xl:p-0 xl:pl-3"
	role="note"
	><span class="mr-1 font-mono text-xs font-bold text-accent">{no}</span>{@render children()}</span
>
