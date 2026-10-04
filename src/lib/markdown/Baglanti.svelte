<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import { ArrowUpRight } from '@lucide/svelte';

	let { href = '', children, ...rest }: HTMLAnchorAttributes & { children?: Snippet } = $props();
	const dis = $derived(/^https?:\/\//.test(href ?? ''));
</script>

<a
	{href}
	{...rest}
	target={dis ? '_blank' : undefined}
	rel={dis ? 'noopener noreferrer' : undefined}
	>{@render children?.()}{#if dis}<ArrowUpRight
			class="ml-0.5 inline size-[0.9em] align-[-0.1em]"
			aria-hidden="true"
		/><span class="sr-only"> (yeni sekmede açılır)</span>{/if}</a
>
