<script lang="ts">
	import { onMount } from 'svelte';
	import { ArrowUpRight, Moon, Rss, Sun } from '@lucide/svelte';
	import { site } from '#lib/site.ts';
	import { zen, zenTemaDegistir, zenTemaOku } from '#lib/zen/tema.svelte.ts';
	import type { Snippet } from 'svelte';

	// Zen'in kabuğu: /zen yerleşimi ve kök hata sayfası (ön-işlenmemiş /zen adresleri) kullanır.
	let { children }: { children: Snippet } = $props();

	const gece = $derived(zen.tema === 'zen-gece');

	onMount(zenTemaOku);
</script>

<svelte:head>
	<link rel="alternate" type="application/rss+xml" title="Zen — {site.ad}" href="/zen/rss.xml" />
</svelte:head>

<!-- Zen: atölyenin başlığı, altlığı ve ızgarası burada yok. Tek sütun, solda; sağ kenar açık. -->
<div class="flex min-h-dvh flex-col bg-base-100 font-zen text-base-content">
	<header class="mx-auto w-full max-w-5xl px-6 sm:px-10">
		<nav class="navbar min-h-0 px-0 pt-6 pb-0 sm:pt-10" aria-label="Zen gezintisi">
			<div class="flex-1">
				<a href="/zen" class="link text-2xl italic link-hover" aria-label="Zen — tüm yazılar">zen</a
				>
			</div>
			<div class="flex-none">
				<button
					type="button"
					class="btn swap btn-circle swap-rotate btn-ghost btn-sm {gece ? 'swap-active' : ''}"
					onclick={zenTemaDegistir}
					aria-label={gece ? 'Gündüz görünümüne geç' : 'Gece görünümüne geç'}
					title={gece ? 'Gündüz' : 'Gece'}
				>
					<Moon class="size-4 swap-on" aria-hidden="true" />
					<Sun class="size-4 swap-off" aria-hidden="true" />
				</button>
			</div>
		</nav>
	</header>

	<main id="icerik" class="mx-auto w-full max-w-5xl grow px-6 pt-16 pb-24 sm:px-10 sm:pt-24">
		{@render children()}
	</main>

	<footer
		class="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-6 pb-10 text-sm text-base-content/70 sm:px-10"
	>
		<p>{site.ad}</p>
		<nav class="flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="Zen alt gezintisi">
			<a class="inline-flex link items-center gap-1.5 link-hover" href="/zen/rss.xml">
				<Rss class="size-3.5" aria-hidden="true" />RSS
			</a>
			<!-- Atölyeye dönüş tam sayfa yüklemesidir: tema betiği yeniden çalışır. -->
			<a class="inline-flex link items-center gap-1 link-hover" href="/" data-sveltekit-reload>
				{site.alanAdi}<ArrowUpRight class="size-3.5" aria-hidden="true" />
			</a>
		</nav>
	</footer>
</div>
