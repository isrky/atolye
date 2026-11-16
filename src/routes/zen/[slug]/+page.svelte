<script lang="ts">
	import { ArrowLeft } from '@lucide/svelte';
	import { site, tarihYaz } from '#lib/site.ts';
	import Paylas from '#lib/ui/yazi/Paylas.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const yazi = $derived(data.yazi);
	const adres = $derived(`${site.url}${yazi.yol}`);
	const aciklama = $derived(yazi.ozet ?? `${site.ad} — Zen`);
</script>

<svelte:head>
	<title>{yazi.baslik} — Zen</title>
	<meta name="description" content={aciklama} />
	<link rel="canonical" href={adres} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={yazi.baslik} />
	<meta property="og:description" content={aciklama} />
	<meta property="og:url" content={adres} />
	<meta property="article:published_time" content={yazi.tarih} />
	<meta property="article:author" content={site.ad} />
</svelte:head>

<article class="max-w-[62ch]">
	<header>
		<h1 class="text-4xl leading-[1.15] font-normal tracking-tight text-balance sm:text-5xl">
			{yazi.baslik}
		</h1>
		<p class="mt-6 text-sm text-base-content/60 italic">
			<time datetime={yazi.tarih}>{tarihYaz(yazi.tarih)}</time> · {yazi.okumaSuresi} dakikalık okuma
			{#if yazi.ornek}· örnek içerik{/if}
		</p>
	</header>

	<div class="mt-14">
		<data.Icerik />
	</div>

	<!-- Bitiş işareti: kapanmamış bir daire. -->
	<div
		class="mt-16 size-5 -rotate-12 rounded-full border border-base-content/50 border-r-transparent"
		aria-hidden="true"
	></div>

	<footer class="mt-16 flex flex-col gap-12">
		<Paylas
			sade
			baslik={yazi.baslik}
			ozet={yazi.ozet ?? ''}
			{adres}
			gorsel={data.paylasim.sosyal}
			dosyaAdi="isrky-zen-{yazi.slug}.png"
		/>

		{#if data.dahaYeni || data.dahaEski}
			<nav class="grid gap-8 sm:grid-cols-2" aria-label="Diğer yazılar">
				{#if data.dahaEski}
					<p>
						<span class="block text-sm text-base-content/60 italic">Daha eski</span>
						<a href={data.dahaEski.yol} class="link text-lg leading-snug link-hover"
							>{data.dahaEski.baslik}</a
						>
					</p>
				{/if}
				{#if data.dahaYeni}
					<p class="sm:col-start-2">
						<span class="block text-sm text-base-content/60 italic">Daha yeni</span>
						<a href={data.dahaYeni.yol} class="link text-lg leading-snug link-hover"
							>{data.dahaYeni.baslik}</a
						>
					</p>
				{/if}
			</nav>
		{/if}

		<a href="/zen" class="inline-flex link items-center gap-2 self-start text-sm link-hover">
			<ArrowLeft class="size-4" aria-hidden="true" />Tüm yazılar
		</a>
	</footer>
</article>
