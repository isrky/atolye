<script lang="ts">
	import { NotebookPen, Rss, Search } from '@lucide/svelte';
	import { site, tarihYaz } from '#lib/site.ts';
	import YaziKarti from '#lib/ui/YaziKarti.svelte';
	import Icindekiler from '#lib/ui/yazilar/Icindekiler.svelte';
	import EtiketRafi from '#lib/ui/yazilar/EtiketRafi.svelte';
	import SeriRafi from '#lib/ui/yazilar/SeriRafi.svelte';
	import { paletiAc } from '#lib/ui/palet.svelte.ts';
	import { PLAN } from '#lib/ui/tercihler.svelte.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const sonSayfa = $derived(data.yazilar[0]);
	const oncekiler = $derived(data.yazilar.slice(1));
	const ilkNo = $derived(data.yazilar.at(-1)?.seriNo);
</script>

<svelte:head>
	<title>Defter — {site.ad}</title>
	<meta
		name="description"
		content="{site.ad}’nın numaralı defter sayfaları: yazılım, kurulumlar, hatalar ve kararlar üzerine yazılar."
	/>
</svelte:head>

<div class="mx-auto flex max-w-7xl flex-col gap-16 px-4 py-10 sm:px-6 sm:py-14 lg:gap-24 lg:px-8">
	<!-- Kapak: dev başlık + defter etiketi -->
	<header class="grid gap-8 lg:grid-cols-12 lg:items-end {PLAN}" data-plan-etiket="DefterKapagi">
		<div class="lg:col-span-7">
			<h1
				class="font-display text-7xl leading-[0.85] font-normal tracking-tight sm:text-8xl lg:text-[10rem]"
			>
				Defter<span aria-hidden="true">.</span>
			</h1>
			<p class="mt-6 max-w-xl text-lg leading-8 text-base-content/85">
				Tezgahta çalışırken tuttuğum numaralı sayfalar: kurulumlar, hatalar, verdiğim kararlar ve
				nedenleri. En yeni sayfa en üstte; numaralar hiç değişmez.
			</p>
		</div>
		<aside
			class="border-2 border-base-content bg-base-100 shadow-sert lg:col-span-5"
			aria-label="Defter künyesi"
		>
			<dl class="grid grid-cols-3 divide-x-2 divide-base-content border-b-2 border-base-content">
				<div class="flex flex-col gap-1 p-4">
					<dt class="font-mono text-xs">Sayfa</dt>
					<dd class="font-display text-4xl tabular-nums">{data.yazilar.length}</dd>
				</div>
				<div class="flex flex-col gap-1 p-4">
					<dt class="font-mono text-xs">Etiket</dt>
					<dd class="font-display text-4xl tabular-nums">{data.etiketler.length}</dd>
				</div>
				<div class="flex flex-col gap-1 p-4">
					<dt class="font-mono text-xs">Seri</dt>
					<dd class="font-display text-4xl tabular-nums">{data.seriler.length}</dd>
				</div>
			</dl>
			<p class="border-b-2 border-base-content px-4 py-3 font-mono text-xs tabular-nums">
				{#if sonSayfa}
					Son kayıt: <time datetime={sonSayfa.tarih}>{tarihYaz(sonSayfa.tarih)}</time> · {ilkNo}–{sonSayfa.seriNo}
				{:else}
					Henüz kayıt yok
				{/if}
			</p>
			<div class="flex flex-wrap gap-3 p-4">
				<button
					type="button"
					class="btn gap-2 border-2 border-base-content shadow-sert-sm transition-[translate,box-shadow] duration-150 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none motion-reduce:transition-none"
					onclick={paletiAc}
				>
					<Search class="size-4" aria-hidden="true" />Sayfalarda ara
					<kbd class="kbd hidden kbd-sm sm:inline-flex" aria-hidden="true">/</kbd>
				</button>
				<a
					href="/rss.xml"
					class="btn gap-2 border-2 border-base-content bg-base-100 shadow-sert-sm transition-[translate,box-shadow] duration-150 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none motion-reduce:transition-none"
				>
					<Rss class="size-4" aria-hidden="true" />RSS ile takip et
				</a>
			</div>
		</aside>
	</header>

	{#if sonSayfa}
		<!-- 7/5: son sayfa açık duruyor, yanında ayraçlar -->
		<div class="grid gap-12 lg:grid-cols-12 lg:gap-10">
			<section aria-labelledby="son-sayfa" class="flex flex-col gap-5 lg:col-span-7">
				<h2 id="son-sayfa" class="flex items-center gap-3 font-display text-2xl font-normal">
					<NotebookPen class="size-6" aria-hidden="true" />Son sayfa
				</h2>
				<YaziKarti yazi={sonSayfa} baslikSeviyesi={3} buyuk />
			</section>

			<div class="flex flex-col gap-12 lg:col-span-5 lg:pt-14">
				<section
					id="etiketler"
					aria-labelledby="etiketler-baslik"
					class="flex scroll-mt-24 flex-col gap-4"
				>
					<h2 id="etiketler-baslik" class="font-display text-2xl font-normal">Etiketler</h2>
					<div class={PLAN} data-plan-etiket="EtiketRafi">
						<EtiketRafi etiketler={data.etiketler} />
					</div>
				</section>
				<section
					id="seriler"
					aria-labelledby="seriler-baslik"
					class="flex scroll-mt-24 flex-col gap-4"
				>
					<h2 id="seriler-baslik" class="font-display text-2xl font-normal">Seriler</h2>
					<div class={PLAN} data-plan-etiket="SeriRafi"><SeriRafi seriler={data.seriler} /></div>
				</section>
			</div>
		</div>

		<!-- 5/7: içindekiler -->
		<section aria-labelledby="icindekiler" class="grid gap-8 lg:grid-cols-12 lg:gap-10">
			<div class="lg:col-span-5">
				<div class="flex flex-col gap-4 lg:sticky lg:top-24">
					<h2 id="icindekiler" class="font-display text-5xl leading-none font-normal sm:text-6xl">
						İçindekiler
					</h2>
					<p class="max-w-sm leading-7 text-base-content/85">
						Önceki sayfalar, yeniden eskiye. Soldaki numara yazının kalıcı kimliği; bağlantı
						verirken ona güvenebilirsin.
					</p>
					<p class="font-mono text-xs tabular-nums">
						{oncekiler.length} sayfa{oncekiler.length
							? ` · ${oncekiler.at(-1)?.seriNo}–${oncekiler[0].seriNo}`
							: ''}
					</p>
				</div>
			</div>
			<div class="lg:col-span-7">
				{#if oncekiler.length}
					<Icindekiler yazilar={oncekiler} etiket="Önceki defter sayfaları" />
				{:else}
					<p
						class="border-2 border-dashed border-base-content/60 bg-base-100 p-6 leading-7 text-base-content/85"
					>
						Şimdilik tek sayfa var: yukarıdaki. Sonraki sayfalar yazıldıkça buraya numaralanarak
						eklenecek; kaçırmamak için RSS akışını takip edebilirsin.
					</p>
				{/if}
			</div>
		</section>
	{:else}
		<section
			aria-labelledby="bos-defter"
			class="max-w-2xl border-2 border-base-content bg-base-100 p-8 shadow-sert"
		>
			<h2 id="bos-defter" class="font-display text-3xl font-normal">Defter henüz boş</h2>
			<p class="mt-3 leading-7 text-base-content/85">
				İlk sayfa yayımlandığında YZ-001 numarasıyla burada açılacak. Haberdar olmak için RSS
				akışını ekleyebilirsin.
			</p>
		</section>
	{/if}
</div>
