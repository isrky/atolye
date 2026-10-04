<script lang="ts">
	import { onMount } from 'svelte';
	import { planDegistir } from './tercihler.svelte';

	// Blueprint katmanı: plan modunda 12 kolonlu ızgara ve 8px modül çizgileri.
	// Konami kodu (↑↑↓↓←→←→BA) da plan modunu açıp kapatır.
	const KONAMI = [
		'ArrowUp',
		'ArrowUp',
		'ArrowDown',
		'ArrowDown',
		'ArrowLeft',
		'ArrowRight',
		'ArrowLeft',
		'ArrowRight',
		'b',
		'a'
	];

	onMount(() => {
		let i = 0;
		const dinle = (e: KeyboardEvent) => {
			const tus = e.key.length === 1 ? e.key.toLowerCase() : e.key;
			i = tus === KONAMI[i] ? i + 1 : tus === KONAMI[0] ? 1 : 0;
			if (i === KONAMI.length) {
				i = 0;
				planDegistir();
			}
		};
		window.addEventListener('keydown', dinle);
		return () => window.removeEventListener('keydown', dinle);
	});
</script>

<div
	class="pointer-events-none fixed inset-0 z-40 hidden bg-[linear-gradient(to_right,color-mix(in_oklch,var(--color-accent)_14%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--color-accent)_14%,transparent)_1px,transparent_1px)] bg-size-[8px_8px] in-data-plan:block"
	aria-hidden="true"
>
	<div
		class="mx-auto grid h-full max-w-7xl grid-cols-4 gap-x-6 px-4 sm:px-6 lg:grid-cols-12 lg:gap-x-sutun lg:px-8"
	>
		{#each Array.from({ length: 12 }, (_, i) => i) as k (k)}
			<div
				class="h-full border-x border-dashed border-accent/50 bg-accent/5 {k >= 4
					? 'max-lg:hidden'
					: ''}"
			></div>
		{/each}
	</div>
	<p
		class="absolute right-3 bottom-3 border-2 border-accent bg-base-100 px-2 py-1 font-mono text-[10px] text-accent"
	>
		PLAN · 8px modül · 12 kolon · ↑↑↓↓←→←→BA
	</p>
</div>
