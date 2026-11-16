<script lang="ts">
	import Kabuk from '#lib/zen/Kabuk.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<Kabuk>{@render children()}</Kabuk>
