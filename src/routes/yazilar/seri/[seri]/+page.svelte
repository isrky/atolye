<script lang="ts">
	import { BookOpen, Layers, Undo2 } from '@lucide/svelte';
	import { site, tarihYaz } from '#lib/site.ts';
	import Icindekiler from '#lib/ui/yazilar/Icindekiler.svelte';
	import SeriRafi from '#lib/ui/yazilar/SeriRafi.svelte';
	import Kirintilar from '#lib/ui/yazilar/Kirintilar.svelte';
	import { PLAN } from '#lib/ui/tercihler.svelte.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const bolumler = $derived(data.seri.yazilar);
	const ilk = $derived(bolumler[0]);
	const son = $derived(bolumler.at(-1));
</script>

<svelte:head>
	<title>{data.seri.ad} serisi — Defter — {site.ad}</title>
	<meta
		name="description"
		content="{site.ad}’nın defterinde {bolumler.length} bölümlük “{data.seri
			.ad}” serisi, okuma sırasıyla."
	/>
</svelte:head>

<div class="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
	<Kirintilar yol={[{ etiket: 'Seriler', href: '/yazilar#seriler' }, { etiket: data.seri.ad }]} />

	<div class="grid gap-10 lg:grid-cols-12">
		<header class="flex flex-col gap-6 lg:col-span-5 {PLAN}" data-plan-etiket="SeriKunyesi">
			<span
				class="flex w-fit items-center gap-2 border-2 border-base-content bg-accent px-2 py-1 font-mono text-xs font-bold text-accent-content tabular-nums"
			>
				<Layers class="size-4" aria-hidden="true" />{bolumler.length} bölümlük seri
			</span>
			<h1
				class="font-display text-5xl leading-[0.95] font-normal text-balance sm:text-6xl lg:text-7xl"
			>
				{data.seri.ad}
			</h1>
			{#if ilk && son}
				<p class="font-mono text-xs tabular-nums">
					<time datetime={ilk.tarih}>{tarihYaz(ilk.tarih)}</time> –
					<time datetime={son.tarih}>{tarihYaz(son.tarih)}</time>
				</p>
			{/if}
			<p class="max-w-md text-lg leading-8 text-base-content/85">
				Bölümler birbirinin üstüne kurulu; en iyisi sırayla okumak. Liste okuma sırasıyla dizildi.
			</p>
			<div class="flex flex-wrap gap-3">
				{#if ilk}
					<a
						href="/yazilar/{ilk.slug}"
						class="btn gap-2 border-2 border-base-content shadow-sert-sm transition-[translate,box-shadow] duration-150 btn-primary hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none motion-reduce:transition-none"
					>
						<BookOpen class="size-4" aria-hidden="true" />1. bölümden başla
					</a>
				{/if}
				<a
					href="/yazilar"
					class="btn gap-2 border-2 border-base-content bg-base-100 shadow-sert-sm transition-[translate,box-shadow] duration-150 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none motion-reduce:transition-none"
				>
					<Undo2 class="size-4" aria-hidden="true" />Tüm sayfalar
				</a>
			</div>
		</header>

		<section aria-labelledby="seri-bolumleri" class="flex flex-col gap-12 lg:col-span-7">
			<div>
				<h2 id="seri-bolumleri" class="sr-only">{data.seri.ad} bölümleri</h2>
				<Icindekiler yazilar={bolumler} etiket="{data.seri.ad} bölümleri" bolum />
			</div>
			{#if data.digerSeriler.length}
				<section aria-labelledby="diger-seriler" class="flex flex-col gap-4">
					<h2 id="diger-seriler" class="font-display text-2xl font-normal">Diğer seriler</h2>
					<SeriRafi seriler={data.digerSeriler} />
				</section>
			{/if}
		</section>
	</div>
</div>
