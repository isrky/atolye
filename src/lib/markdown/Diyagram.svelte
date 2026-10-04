<script lang="ts">
	import { onMount } from 'svelte';

	// Mermaid yalnızca diyagram içeren sayfada, tarayıcıda yüklenir; tema değişince yeniden çizilir.
	let { kod, baslik }: { kod: string; baslik: string } = $props();

	let svg = $state('');
	let durum = $state<'yukleniyor' | 'hazir' | 'hata'>('yukleniyor');
	const uid = $props.id();
	const id = `diyagram-${uid}`;

	async function ciz() {
		try {
			const { default: mermaid } = await import('mermaid');
			const koyu = document.documentElement.dataset.theme === 'gece-vardiyasi';
			const css = getComputedStyle(document.documentElement);
			// Mermaid oklch() çözemez: tema rengini 1px tuvale boyayıp #rrggbb olarak okuruz.
			const tuval = document
				.createElement('canvas')
				.getContext('2d', { willReadFrequently: true })!;
			const renk = (ad: string) => {
				tuval.clearRect(0, 0, 1, 1);
				tuval.fillStyle = css.getPropertyValue(ad).trim();
				tuval.fillRect(0, 0, 1, 1);
				const [r, g, b] = tuval.getImageData(0, 0, 1, 1).data;
				return `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`;
			};
			mermaid.initialize({
				startOnLoad: false,
				securityLevel: 'strict',
				theme: 'base',
				fontFamily: 'JetBrains Mono, monospace',
				themeVariables: {
					darkMode: koyu,
					background: renk('--color-base-100'),
					primaryColor: renk('--color-primary'),
					primaryTextColor: renk('--color-primary-content'),
					primaryBorderColor: renk('--color-base-content'),
					lineColor: renk('--color-base-content'),
					secondaryColor: renk('--color-secondary'),
					tertiaryColor: renk('--color-base-200'),
					textColor: renk('--color-base-content')
				}
			});
			// securityLevel: 'strict' ile mermaid çıktıyı temizler.
			svg = (await mermaid.render(`${id}-${Date.now()}`, kod)).svg;
			durum = 'hazir';
		} catch (e) {
			console.error(e);
			durum = 'hata';
		}
	}

	onMount(() => {
		ciz();
		const gozlemci = new MutationObserver(ciz);
		gozlemci.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-theme']
		});
		return () => gozlemci.disconnect();
	});
</script>

<figure class="not-prose my-10 border-2 border-base-content bg-base-100 p-4 shadow-sert">
	{#if durum === 'yukleniyor'}
		<div class="h-48 w-full skeleton" aria-hidden="true"></div>
	{:else if durum === 'hata'}
		<pre class="overflow-x-auto font-mono text-sm">{kod}</pre>
	{/if}
	<div
		role="img"
		aria-label={baslik}
		class="flex justify-center overflow-x-auto [&_svg]:h-auto [&_svg]:max-w-full"
	>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html svg}
	</div>
	<figcaption class="mt-3 border-t-2 border-dashed border-base-content/40 pt-2 font-mono text-xs">
		Şekil: {baslik}
	</figcaption>
</figure>
