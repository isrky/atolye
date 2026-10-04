<script lang="ts">
	import { untrack } from 'svelte';
	import { ArrowLeft, ArrowUpRight, CodeXml, FlaskConical, Globe } from '@lucide/svelte';
	import { site } from '#lib/site.ts';
	import { PROJE_DURUMLARI } from '#lib/content/sema.ts';
	import ProjeKarti from '#lib/ui/ProjeKarti.svelte';
	import Sayac from '#lib/ui/Sayac.svelte';
	import Damgalar from '#lib/ui/Damgalar.svelte';
	import Datasheet from '#lib/ui/projeler/Datasheet.svelte';
	import { CanliIcerik } from '#lib/ui/canli.svelte.ts';
	import { PLAN } from '#lib/ui/tercihler.svelte.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const proje = $derived(data.proje);

	// Her parça kendi sayacını taşır: slug değişince yeni örnek, yeni ölçüm.
	const canli = $derived(new CanliIcerik('proje', data.proje.slug));
	$effect(() => {
		const c = canli;
		untrack(() => c.baslat());
	});

	const durumRengi = {
		yayinda: 'status-success',
		devam: 'status-warning',
		arsiv: 'bg-base-content/60'
	} as const;
	const GENISLIK = ['lg:col-span-7', 'lg:col-span-5'] as const;

	const alanAdi = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');
	const BASKI =
		'transition-[translate,box-shadow] duration-150 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent motion-reduce:transition-none';
</script>

<svelte:head>
	<title>{proje.baslik} · {proje.parcaNo} — {site.ad}</title>
	<meta name="description" content={proje.ozet} />
	<link rel="canonical" href="{site.url}/projeler/{proje.slug}" />
	<meta property="og:title" content="{proje.baslik} · {proje.parcaNo}" />
	<meta property="og:description" content={proje.ozet} />
	<meta property="og:url" content="{site.url}/projeler/{proje.slug}" />
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
	<nav class="breadcrumbs font-mono text-sm" aria-label="Konum">
		<ul>
			<li><a href="/" class="link link-hover">Atölye</a></li>
			<li><a href="/projeler" class="link link-hover">Projeler</a></li>
			<li><span aria-current="page" class="font-bold tabular-nums">{proje.parcaNo}</span></li>
		</ul>
	</nav>

	<header
		class="mt-8 grid items-start gap-x-sutun gap-y-10 lg:grid-cols-12 {PLAN}"
		data-plan-etiket="ParcaBasligi · 7/5"
	>
		<div class="min-w-0 lg:col-span-7">
			<div class="flex flex-wrap items-center gap-3">
				<p
					class="inline-flex items-center gap-3 border-2 border-base-content bg-accent px-3 py-1.5 font-mono text-sm font-bold tracking-wider text-accent-content shadow-sert-sm"
				>
					<span
						class="size-3.5 rounded-full border-2 border-accent-content bg-base-100"
						aria-hidden="true"
					></span>
					<span><span class="sr-only">Parça numarası </span>{proje.parcaNo}</span>
				</p>
				<p class="inline-flex items-center gap-2 font-mono text-sm">
					<span class="status status-md {durumRengi[proje.durum]}" aria-hidden="true"></span>
					<span><span class="sr-only">Durum: </span>{PROJE_DURUMLARI[proje.durum]}</span>
				</p>
				{#if proje.ornek}
					<span class="badge gap-1.5 border-base-content font-mono text-xs badge-secondary">
						<FlaskConical class="size-3.5" aria-hidden="true" />
						Örnek içerik
					</span>
				{/if}
			</div>

			<h1
				class="mt-6 font-display text-5xl leading-[0.95] font-normal tracking-tight break-words sm:text-7xl"
			>
				{proje.baslik}
			</h1>
			<p class="mt-6 max-w-2xl text-xl leading-relaxed text-base-content/85">{proje.ozet}</p>
			{#if proje.ornek}
				<p class="mt-3 max-w-2xl text-sm text-base-content/75">
					Bu kayıt, rafın nasıl göründüğünü göstermek için konmuş bir örnek; gerçek bir proje değil.
				</p>
			{/if}

			<div class="mt-8 flex flex-wrap gap-4 {PLAN}" data-plan-etiket="Baglantilar">
				{#if proje.baglantilar.canli}
					<a
						href={proje.baglantilar.canli}
						target="_blank"
						rel="noopener noreferrer"
						class="btn border-base-content shadow-sert btn-primary {BASKI}"
					>
						<Globe class="size-4" aria-hidden="true" />
						Canlı
						<span class="font-mono text-xs font-normal">{alanAdi(proje.baglantilar.canli)}</span>
						<ArrowUpRight class="size-4" aria-hidden="true" />
						<span class="sr-only">(dış bağlantı, yeni sekmede açılır)</span>
					</a>
				{/if}
				{#if proje.baglantilar.kaynak}
					<a
						href={proje.baglantilar.kaynak}
						target="_blank"
						rel="noopener noreferrer"
						class="btn border-base-content bg-base-100 shadow-sert {BASKI}"
					>
						<CodeXml class="size-4" aria-hidden="true" />
						Kaynak kodu
						<ArrowUpRight class="size-4" aria-hidden="true" />
						<span class="sr-only">(dış bağlantı, yeni sekmede açılır)</span>
					</a>
				{/if}
				{#if !proje.baglantilar.canli && !proje.baglantilar.kaynak}
					<p
						class="border-2 border-dashed border-base-content/40 px-3 py-2 font-mono text-xs text-base-content/75"
					>
						Bu parçanın yayımlanmış kaynağı ya da canlı sürümü yok; belgesi yalnızca bu sayfada.
					</p>
				{/if}
			</div>
		</div>

		<div class="min-w-0 lg:col-span-5">
			<Datasheet {proje}>
				{#snippet alt()}
					<div class="flex flex-wrap items-center justify-between gap-3">
						<span class="font-mono text-xs font-bold tracking-wider uppercase">Canlı ölçüm</span>
						{#if canli.durum === 'hata'}
							<span class="font-mono text-xs text-base-content/75">Sayaç şu an çevrimdışı</span>
						{:else}
							<Sayac {canli} />
						{/if}
					</div>
				{/snippet}
			</Datasheet>
		</div>
	</header>

	<div class="mt-16 grid gap-x-sutun gap-y-10 lg:grid-cols-12">
		{#if proje.toc.length}
			<aside class="lg:col-span-4">
				<nav
					class="border-2 border-base-content bg-base-100 p-5 lg:sticky lg:top-24 {PLAN}"
					aria-labelledby="toc-baslik"
					data-plan-etiket="Icindekiler"
				>
					<h2 id="toc-baslik" class="font-mono text-xs font-bold tracking-wider uppercase">
						Bu datasheet'te
					</h2>
					<ol class="mt-3 space-y-2 border-l-2 border-base-content/30 text-sm">
						{#each proje.toc as t, i (t.id)}
							<li class={t.seviye > 2 ? 'pl-7' : 'pl-3'}>
								<a href="#{t.id}" class="flex link gap-2 link-hover">
									<span
										class="font-mono text-xs text-base-content/60 tabular-nums"
										aria-hidden="true">{String(i + 1).padStart(2, '0')}</span
									>
									{t.metin}
								</a>
							</li>
						{/each}
					</ol>
				</nav>
			</aside>
		{/if}

		<div class="min-w-0 lg:col-span-8 lg:col-start-5">
			<article
				class={PLAN}
				data-plan-etiket="Govde · mdsvex"
				aria-label="{proje.baslik} ayrıntıları"
			>
				<data.Icerik />
			</article>

			<div class="mt-16">
				<Damgalar {canli} />
			</div>
		</div>
	</div>

	{#if data.digerleri.length}
		<section
			class="mt-20 {PLAN}"
			aria-labelledby="diger-baslik"
			data-plan-etiket="DigerParcalar · 7/5"
		>
			<div
				class="flex flex-wrap items-end justify-between gap-4 border-b-2 border-base-content pb-3"
			>
				<h2 id="diger-baslik" class="font-display text-3xl font-normal sm:text-4xl">
					Diğer parçalar
				</h2>
				<a href="/projeler" class="inline-flex link items-center gap-2 font-mono text-sm">
					<ArrowLeft class="size-4" aria-hidden="true" />
					<span>Rafın tamamı (<span class="tabular-nums">{data.toplam}</span>)</span>
				</a>
			</div>
			<ul class="mt-8 grid gap-x-sutun gap-y-8 lg:grid-cols-12">
				{#each data.digerleri as p, i (p.slug)}
					<li class="grid {GENISLIK[i % 2]}">
						<ProjeKarti proje={p} baslikSeviyesi={3} />
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</div>
