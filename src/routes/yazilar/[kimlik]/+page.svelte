<script lang="ts">
	import { untrack } from 'svelte';
	import {
		ArrowLeft,
		CalendarDays,
		Clock,
		Copy,
		FlaskConical,
		Layers,
		Notebook,
		PencilLine,
		Tag
	} from '@lucide/svelte';
	import { site, tarihYaz } from '#lib/site.ts';
	import { CanliIcerik } from '#lib/ui/canli.svelte.ts';
	import { baglantiKopyala } from '#lib/ui/kopyala.ts';
	import { PLAN } from '#lib/ui/tercihler.svelte.ts';
	import Sayac from '#lib/ui/Sayac.svelte';
	import Damgalar from '#lib/ui/Damgalar.svelte';
	import YaziKarti from '#lib/ui/YaziKarti.svelte';
	import Icindekiler from '#lib/ui/yazi/Icindekiler.svelte';
	import SeriGezgini from '#lib/ui/yazi/SeriGezgini.svelte';
	import Paylas from '#lib/ui/yazi/Paylas.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const yazi = $derived(data.yazi);
	const adres = $derived(`${site.url}${yazi.yol}`);

	// Her yazı kendi canlı sayacını alır; istemci tarafı geçişte yeni örnek oluşur ve yeniden başlar.
	const canli = $derived(new CanliIcerik('yazi', data.yazi.slug));
	$effect(() => {
		const c = canli;
		untrack(() => c.baslat());
	});

	// Okuma ilerlemesi ve etkin bölüm: yalnızca tarayıcıda ölçülür (sunucuda null kalır).
	let yaprak = $state<HTMLElement>();
	let aktif = $state<string | null>(null);
	let ilerleme = $state<number | null>(null);

	$effect(() => {
		const toc = data.yazi.toc;
		const el = yaprak;
		if (!el) return;
		let kare = 0;
		const olc = () => {
			const r = el.getBoundingClientRect();
			const yol = r.height - innerHeight;
			const oran = yol <= 0 ? (r.bottom <= innerHeight ? 1 : 0) : -r.top / yol;
			ilerleme = Math.round(Math.min(1, Math.max(0, oran)) * 100);
			let bulunan: string | null = null;
			for (const o of toc) {
				const h = document.getElementById(o.id);
				if (h && h.getBoundingClientRect().top <= 128) bulunan = o.id;
			}
			aktif = bulunan;
		};
		const planla = () => {
			cancelAnimationFrame(kare);
			kare = requestAnimationFrame(olc);
		};
		planla();
		addEventListener('scroll', planla, { passive: true });
		addEventListener('resize', planla);
		return () => {
			cancelAnimationFrame(kare);
			removeEventListener('scroll', planla);
			removeEventListener('resize', planla);
		};
	});
</script>

<svelte:head>
	<title>{yazi.seriNo} · {yazi.baslik} — {site.ad}</title>
	<meta name="description" content={yazi.ozet} />
	<link rel="canonical" href={adres} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={yazi.baslik} />
	<meta property="og:description" content={yazi.ozet} />
	<meta property="og:url" content={adres} />
	<meta property="article:published_time" content={yazi.tarih} />
	{#if yazi.guncelleme}
		<meta property="article:modified_time" content={yazi.guncelleme} />
	{/if}
	{#each yazi.etiketler as e (e)}
		<meta property="article:tag" content={e} />
	{/each}
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
	<nav class="breadcrumbs font-mono text-sm" aria-label="Konum">
		<ul>
			<li>
				<a href="/yazilar" class="inline-flex items-center gap-2"
					><Notebook class="size-4" aria-hidden="true" />Defter</a
				>
			</li>
			<li><span aria-current="page" class="font-bold tabular-nums">{yazi.seriNo}</span></li>
		</ul>
	</nav>

	<article aria-labelledby="yazi-baslik">
		<header
			class="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end {PLAN}"
			data-plan-etiket="Baslik · 7/5"
		>
			<div class="lg:col-span-7">
				<div class="flex flex-wrap items-center gap-3">
					<span
						class="border-2 border-base-content bg-primary px-2 py-1 font-mono text-lg leading-none font-bold text-primary-content tabular-nums shadow-sert-sm"
						>{yazi.seriNo}</span
					>
					{#if data.seri && yazi.seri}
						<a
							href="/yazilar/seri/{data.seri.slug}"
							class="badge gap-1.5 border-2 border-base-content bg-base-100 font-mono text-xs hover:bg-base-200"
						>
							<Layers class="size-3.5" aria-hidden="true" />{data.seri.ad} · {yazi.seri.sira}/{data
								.seri.bolumler.length}
						</a>
					{/if}
					{#if yazi.ornek}
						<span
							class="badge gap-1.5 border-2 border-base-content font-mono text-xs badge-secondary"
							title="Bu sayfa sitenin bileşenlerini göstermek için yazılmış örnek bir içerik."
						>
							<FlaskConical class="size-3.5" aria-hidden="true" />Örnek içerik
						</span>
					{/if}
				</div>
				<h1
					id="yazi-baslik"
					class="mt-5 font-display text-4xl leading-[1.05] font-normal tracking-tight text-balance sm:text-5xl"
				>
					{yazi.baslik}
				</h1>
				<p class="mt-5 max-w-2xl text-xl leading-relaxed text-base-content/80">{yazi.ozet}</p>
			</div>

			<aside
				class="border-2 border-base-content bg-base-100 shadow-sert lg:col-span-5 {PLAN}"
				aria-label="Sayfa künyesi"
				data-plan-etiket="Kunye"
			>
				<p
					class="border-b-2 border-base-content bg-neutral px-4 py-1.5 font-mono text-xs font-bold tracking-wider text-neutral-content uppercase"
				>
					Sayfa künyesi
				</p>
				<dl class="divide-y-2 divide-base-content/15 px-4 text-sm">
					<div class="flex items-center justify-between gap-4 py-2.5">
						<dt class="flex items-center gap-2 font-mono text-xs">
							<CalendarDays class="size-4" aria-hidden="true" />Yazıldı
						</dt>
						<dd><time datetime={yazi.tarih}>{tarihYaz(yazi.tarih)}</time></dd>
					</div>
					{#if yazi.guncelleme}
						<div class="flex items-center justify-between gap-4 py-2.5">
							<dt class="flex items-center gap-2 font-mono text-xs">
								<PencilLine class="size-4" aria-hidden="true" />Güncellendi
							</dt>
							<dd><time datetime={yazi.guncelleme}>{tarihYaz(yazi.guncelleme)}</time></dd>
						</div>
					{/if}
					<div class="flex items-center justify-between gap-4 py-2.5">
						<dt class="flex items-center gap-2 font-mono text-xs">
							<Clock class="size-4" aria-hidden="true" />Okuma
						</dt>
						<dd class="tabular-nums">{yazi.okumaSuresi} dk</dd>
					</div>
					{#if data.etiketler.length}
						<div class="flex items-start justify-between gap-4 py-2.5">
							<dt class="flex items-center gap-2 py-0.5 font-mono text-xs">
								<Tag class="size-4" aria-hidden="true" />Etiketler
							</dt>
							<dd>
								<ul class="flex flex-wrap justify-end gap-1.5">
									{#each data.etiketler as e (e.slug)}
										<li>
											<a
												href="/yazilar/etiket/{e.slug}"
												class="badge border-2 border-base-content bg-base-200 font-mono badge-sm hover:bg-base-300"
												>#{e.ad}</a
											>
										</li>
									{/each}
								</ul>
							</dd>
						</div>
					{/if}
				</dl>
				<div
					class="flex flex-wrap items-center justify-between gap-3 border-t-2 border-base-content px-4 py-3"
				>
					<Sayac {canli} />
					<button
						type="button"
						class="btn ml-auto gap-2 border-2 border-base-content shadow-sert-sm transition-[translate,box-shadow] duration-150 btn-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none motion-reduce:transition-none"
						onclick={() => baglantiKopyala(adres)}
					>
						<Copy class="size-4" aria-hidden="true" />Bağlantıyı kopyala
					</button>
					<Paylas
						baslik={yazi.baslik}
						ozet={yazi.ozet}
						{adres}
						gorsel={data.paylasim.sosyal}
						dosyaAdi="isrky-{yazi.kimlik}.png"
					/>
				</div>
			</aside>
		</header>

		<div class="mt-10 grid gap-8 lg:grid-cols-[13rem_minmax(0,1fr)]">
			{#if yazi.toc.length}
				<!-- Plan etiketi kapsayıcıda: yapışkan rayın `sticky` konumu korunur. -->
				<div class="hidden lg:block {PLAN}" data-plan-etiket="Icindekiler · ray">
					<Icindekiler toc={yazi.toc} {aktif} {ilerleme} yerlesim="ray" />
				</div>
				<div class="lg:hidden">
					<Icindekiler toc={yazi.toc} {aktif} {ilerleme} yerlesim="katlanir" />
				</div>
			{/if}

			<div
				bind:this={yaprak}
				class="relative min-w-0 border-2 border-base-content bg-base-100 py-10 pr-5 pl-14 shadow-sert sm:pr-10 sm:pl-18 xl:pr-[20rem] {yazi
					.toc.length
					? ''
					: 'lg:col-start-2'} {PLAN}"
				data-plan-etiket="DefterYapragi · {yazi.seriNo}"
			>
				<!-- Defter delikleri ve kırmızı marj çizgisi: sayfanın fiziksel kenarı. -->
				<div
					class="pointer-events-none absolute inset-y-0 left-0 w-9 border-r-2 border-secondary/70 bg-[radial-gradient(circle_at_50%_50%,var(--color-base-content)_0_5px,transparent_6px)] bg-size-[36px_48px] bg-repeat-y opacity-90 sm:w-11 sm:bg-size-[44px_48px]"
					aria-hidden="true"
				></div>
				<!-- Kenar notu sütunu: <Dipnot> notları geniş ekranda buraya düşer. -->
				<div
					class="pointer-events-none absolute inset-y-0 right-0 hidden w-[18rem] border-l-2 border-dashed border-base-content/25 bg-base-200/50 xl:block"
					aria-hidden="true"
				>
					<p class="px-4 pt-10 font-mono text-xs tracking-wider text-base-content/60 uppercase">
						Kenar notları
					</p>
				</div>
				<data.Icerik />
			</div>
		</div>
	</article>

	<div class="mt-12 grid gap-8 lg:grid-cols-12 lg:items-start">
		<div class="grid gap-8 lg:col-span-5">
			{#if data.seri}
				<SeriGezgini
					seri={data.seri}
					simdiki={yazi.slug}
					onceki={data.onceki}
					sonraki={data.sonraki}
				/>
			{:else}
				<nav
					class="border-2 border-base-content bg-base-100 p-5 shadow-sert {PLAN}"
					aria-labelledby="devam-baslik"
					data-plan-etiket="DevamEt"
				>
					<h2 id="devam-baslik" class="font-display text-xl font-normal">Bu sayfa tek yapraklık</h2>
					<p class="mt-1 text-sm text-base-content/75">
						Bir serinin parçası değil. Aynı konudaki diğer sayfalar etiketlerde:
					</p>
					<ul class="mt-4 flex flex-wrap gap-2">
						{#each data.etiketler as e (e.slug)}
							<li>
								<a
									href="/yazilar/etiket/{e.slug}"
									class="badge border-2 border-base-content bg-base-200 font-mono hover:bg-base-300"
									>#{e.ad}</a
								>
							</li>
						{/each}
					</ul>
				</nav>
			{/if}
		</div>
		<div class="lg:col-span-7">
			<Damgalar {canli} />
		</div>
	</div>

	<section class="mt-16 {PLAN}" aria-labelledby="ilgili-baslik" data-plan-etiket="IlgiliSayfalar">
		<h2 id="ilgili-baslik" class="font-display text-3xl font-normal">Yan yapraklar</h2>
		<p class="mt-1 text-base-content/75">Bu sayfayla etiket paylaşan diğer defter sayfaları.</p>
		{#if data.ilgili.length}
			<ul class="mt-6 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
				{#each data.ilgili as y (y.slug)}
					<li><YaziKarti yazi={y} /></li>
				{/each}
			</ul>
		{:else}
			<p class="mt-6 border-2 border-dashed border-base-content/40 p-5 font-mono text-sm">
				Bu sayfayla etiket paylaşan başka bir sayfa henüz yok. Defterin tamamına göz atabilirsin.
			</p>
		{/if}
	</section>

	<div class="mt-12">
		<a
			href="/yazilar"
			class="btn gap-2 border-2 border-base-content shadow-sert-sm transition-[translate,box-shadow] duration-150 btn-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none motion-reduce:transition-none"
		>
			<ArrowLeft class="size-4" aria-hidden="true" />Tüm defter sayfaları
		</a>
	</div>
</div>
