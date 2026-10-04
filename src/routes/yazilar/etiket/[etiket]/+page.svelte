<script lang="ts">
	import { Undo2 } from '@lucide/svelte';
	import { site } from '#lib/site.ts';
	import Icindekiler from '#lib/ui/yazilar/Icindekiler.svelte';
	import EtiketRafi from '#lib/ui/yazilar/EtiketRafi.svelte';
	import Kirintilar from '#lib/ui/yazilar/Kirintilar.svelte';
	import { PLAN } from '#lib/ui/tercihler.svelte.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const digerleri = $derived(data.etiketler.filter((e) => e.slug !== data.etiket.slug));
</script>

<svelte:head>
	<title>#{data.etiket.ad} — Defter — {site.ad}</title>
	<meta
		name="description"
		content="{site.ad}’nın defterinde #{data.etiket.ad} etiketli {data.yazilar.length} sayfa."
	/>
</svelte:head>

<div class="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
	<Kirintilar
		yol={[{ etiket: 'Etiketler', href: '/yazilar#etiketler' }, { etiket: `#${data.etiket.ad}` }]}
	/>

	<div class="grid gap-10 lg:grid-cols-12">
		<header class="flex flex-col gap-6 lg:col-span-5 {PLAN}" data-plan-etiket="EtiketKunyesi">
			<h1
				class="font-display leading-[0.9] font-normal break-words {data.etiket.ad.length > 9
					? 'text-4xl sm:text-5xl lg:text-6xl'
					: data.etiket.ad.length > 6
						? 'text-5xl sm:text-6xl lg:text-7xl'
						: 'text-6xl sm:text-7xl lg:text-8xl'}"
			>
				<span class="text-secondary" aria-hidden="true">#</span>{data.etiket.ad}
			</h1>
			<p class="max-w-md text-lg leading-8 text-base-content/85">
				Defterde bu ayracı taşıyan <strong class="tabular-nums">{data.yazilar.length}</strong>
				sayfa var, yeniden eskiye sıralı.
			</p>
			<a
				href="/yazilar"
				class="btn w-fit gap-2 border-2 border-base-content bg-base-100 shadow-sert-sm transition-[translate,box-shadow] duration-150 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none motion-reduce:transition-none"
			>
				<Undo2 class="size-4" aria-hidden="true" />Filtreyi kaldır, tüm sayfalar
			</a>
			{#if digerleri.length}
				<section aria-labelledby="diger-etiketler" class="mt-4 flex flex-col gap-3">
					<h2 id="diger-etiketler" class="font-mono text-sm font-bold">Tüm etiketler</h2>
					<EtiketRafi etiketler={data.etiketler} aktif={data.etiket.slug} />
				</section>
			{/if}
		</header>

		<section aria-labelledby="etiketli-sayfalar" class="lg:col-span-7">
			<h2 id="etiketli-sayfalar" class="sr-only">#{data.etiket.ad} etiketli sayfalar</h2>
			{#if data.yazilar.length}
				<Icindekiler yazilar={data.yazilar} etiket="#{data.etiket.ad} etiketli sayfalar" />
			{:else}
				<p class="border-2 border-dashed border-base-content/60 bg-base-100 p-6 leading-7">
					Bu etiketi taşıyan sayfa kalmamış; büyük olasılıkla yazılar yeniden etiketlendi.
					<a href="/yazilar" class="link font-semibold">Tüm sayfalara dön</a>.
				</p>
			{/if}
		</section>
	</div>
</div>
