<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<div class="not-prose my-8 overflow-x-auto border-2 border-base-content shadow-sert">
	<table class="table table-zebra">
		{@render children?.()}
	</table>
</div>
