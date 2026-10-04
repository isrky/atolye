<script lang="ts">
	import {
		ArrowRight,
		ArrowUpRight,
		AtSign,
		BookOpen,
		BriefcaseBusiness,
		CodeXml,
		GitBranch,
		Mail,
		MapPin,
		NotebookPen,
		PencilRuler,
		PlugZap,
		Rss,
		Search
	} from '@lucide/svelte';
	import { site, tarihYaz } from '#lib/site.ts';
	import { baglantilar, type Baglanti } from '#lib/data/baglantilar.ts';
	import YaziKarti from '#lib/ui/YaziKarti.svelte';
	import ProjeKarti from '#lib/ui/ProjeKarti.svelte';
	import { paletiAc } from '#lib/ui/palet.svelte.ts';
	import { PLAN } from '#lib/ui/tercihler.svelte.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// TODO(İsmail): konumlandırma cümlesini kendi sesinle yeniden yaz.
	const konumlandirma =
		'Yazılım mühendisi. Sistemleri parça parça kurar, ölçer ve öğrendiklerini bu tezgahta numaralı defter sayfalarına yazarım.';

	// TODO(İsmail): şu an üzerinde çalıştığın işi buraya yaz (el yazısı not, kısa tut).
	const suAn = 'bu sitenin canlı sayaçlarını ve lastik damgalarını cilalıyorum';

	const adKelimeleri = site.ad.toLocaleUpperCase('tr-TR').split(' ');

	const ikonlar = {
		'git-branch': GitBranch,
		'briefcase-business': BriefcaseBusiness,
		mail: Mail,
		rss: Rss,
		'at-sign': AtSign,
		'book-open': BookOpen,
		'code-xml': CodeXml
	} satisfies Record<Baglanti['ikon'], unknown>;

	const prizler = baglantilar.filter((b) => b.one);
	const disBaglanti = (href: string) => /^https?:\/\//.test(href);

	const baslik = `${site.ad} — ${site.unvan}`;
</script>

<svelte:head>
	<title>{baslik}</title>
	<meta name="description" content={site.aciklama} />
	<link rel="canonical" href={site.url} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={baslik} />
	<meta property="og:description" content={site.aciklama} />
	<meta property="og:url" content={site.url} />
	<meta name="twitter:card" content="summary" />
</svelte:head>

<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
	<!-- Tezgahın başı: 7/5 bölme — solda isim plakası, sağda el yazısı not ve sayaçlar. -->
	<section
		class="hero place-items-stretch py-12 sm:py-16 lg:py-24 {PLAN}"
		aria-labelledby="ana-baslik"
		data-plan-etiket="Kahraman · 7/5"
	>
		<div
			class="hero-content grid w-full max-w-none grid-cols-1 items-start gap-12 p-0 lg:grid-cols-12 lg:gap-8"
		>
			<div class="lg:col-span-7">
				<h1
					id="ana-baslik"
					class="font-display text-5xl leading-[0.8] font-normal tracking-tight sm:text-7xl lg:text-8xl xl:text-[7rem]"
					aria-label={site.ad}
				>
					{#each adKelimeleri as kelime, i (kelime)}
						<span class="block overflow-hidden pt-[0.2em] pb-[0.02em]" aria-hidden="true">
							<span
								class="inline-block transition-[translate] duration-700 ease-out motion-reduce:transition-none starting:translate-y-[110%] motion-reduce:starting:translate-y-0 {i ===
								1
									? 'delay-150'
									: ''}">{kelime}</span
							>
						</span>
					{/each}
				</h1>

				<p class="mt-8 max-w-xl text-lg leading-relaxed text-base-content/85 sm:text-xl">
					{konumlandirma}
				</p>

				<div class="mt-10 flex flex-wrap items-center gap-3">
					<a
						href="/yazilar"
						class="btn border-2 border-base-content shadow-sert transition-[translate,box-shadow] duration-150 btn-lg btn-primary hover:translate-x-1 hover:translate-y-1 hover:shadow-none motion-reduce:transition-none"
					>
						<NotebookPen class="size-5" aria-hidden="true" />
						Defteri aç
					</a>
					<a
						href="/projeler"
						class="btn border-2 border-base-content bg-base-100 shadow-sert-sm transition-[translate,box-shadow] duration-150 btn-lg hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none motion-reduce:transition-none"
					>
						<PencilRuler class="size-5" aria-hidden="true" />
						Projelere bak
					</a>
				</div>

				<p class="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs">
					<span class="flex items-center gap-1.5"
						><MapPin class="size-4" aria-hidden="true" />{site.konum}</span
					>
					<span>{site.unvan}</span>
					<button
						type="button"
						class="flex link items-center gap-1.5 link-hover"
						onclick={paletiAc}
					>
						<Search class="size-4" aria-hidden="true" />tezgahta ara
						<kbd class="kbd kbd-xs">⌘K</kbd>
					</button>
				</p>
			</div>

			<div class="relative lg:col-span-5 lg:pt-6">
				<!-- El yazısı not: sitedeki tek Caveat kullanımı. Bantla tutturulmuş. -->
				<aside
					class="relative z-10 mx-auto max-w-sm -rotate-2 border-2 border-base-content bg-primary px-6 pt-8 pb-6 text-primary-content shadow-sert-lg transition-[translate,opacity] delay-300 duration-500 ease-out before:absolute before:-top-3 before:left-1/2 before:h-6 before:w-24 before:-translate-x-1/2 before:rotate-3 before:border-x-2 before:border-dashed before:border-base-content/30 before:bg-base-100/70 motion-reduce:transition-none lg:mr-0 lg:ml-auto starting:-translate-y-4 starting:opacity-0 {PLAN}"
					aria-label="Şu an üzerinde çalıştığım iş"
					data-plan-etiket="El notu"
				>
					<p class="font-el text-4xl leading-tight">
						<span class="underline decoration-primary-content decoration-[3px] underline-offset-4"
							>şu an:</span
						>
						{suAn}
					</p>
					<p class="mt-4 text-right font-mono text-[11px]">— İ.S.</p>
				</aside>

				<div
					class="stats relative mt-8 w-full border-2 border-base-content bg-base-100 shadow-sert lg:mt-10 {PLAN}"
					data-plan-etiket="Sayaç plakası"
				>
					<a
						href="/yazilar"
						class="stat px-4 transition-colors hover:bg-base-200 focus-visible:bg-base-200 sm:px-6"
					>
						<div class="stat-figure max-sm:hidden">
							<NotebookPen class="size-6" aria-hidden="true" />
						</div>
						<div class="stat-title font-mono text-xs">Defter</div>
						<div class="stat-value font-display text-4xl font-normal tabular-nums">
							{data.yaziSayisi}
						</div>
						<div class="stat-desc font-mono">
							sayfa{#if data.sonTarih}<br />son:
								<time datetime={data.sonTarih}>{tarihYaz(data.sonTarih)}</time>{/if}
						</div>
					</a>
					<a
						href="/projeler"
						class="stat px-4 transition-colors hover:bg-base-200 focus-visible:bg-base-200 sm:px-6"
					>
						<div class="stat-figure max-sm:hidden">
							<PencilRuler class="size-6" aria-hidden="true" />
						</div>
						<div class="stat-title font-mono text-xs">Tezgah</div>
						<div class="stat-value font-display text-4xl font-normal tabular-nums">
							{data.projeSayisi}
						</div>
						<div class="stat-desc font-mono">parça<br />etiketli</div>
					</a>
				</div>
			</div>
		</div>
	</section>

	<!-- Defter: 5/7 bölme — solda başlık ve iki küçük sayfa, sağda en yeni sayfa büyük. -->
	<section
		class="border-t-2 border-base-content py-16 lg:py-24 {PLAN}"
		aria-labelledby="defter-baslik"
		data-plan-etiket="Defter · 5/7"
	>
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
			<div class="flex flex-col gap-8 lg:col-span-5">
				<header>
					<p class="font-mono text-xs font-bold" aria-hidden="true">§01 / YZ</p>
					<h2
						id="defter-baslik"
						class="mt-2 font-display text-4xl leading-none font-normal sm:text-5xl"
					>
						Defterden son sayfalar
					</h2>
					<p class="mt-4 max-w-md text-base-content/85">
						Her yazı seri numaralı bir sayfa: deneyler, ölçümler, yarım kalanlar dahil.
					</p>
					<a href="/yazilar" class="mt-4 inline-flex link items-center gap-1.5 font-semibold">
						Tüm defter ({data.yaziSayisi} sayfa)
						<ArrowRight class="size-4" aria-hidden="true" />
					</a>
				</header>
				{#each data.sonYazilar.slice(1) as yazi (yazi.slug)}
					<YaziKarti {yazi} baslikSeviyesi={3} />
				{/each}
			</div>
			{#if data.sonYazilar[0]}
				<div class="lg:col-span-7 lg:pt-12">
					<YaziKarti yazi={data.sonYazilar[0]} baslikSeviyesi={3} buyuk />
				</div>
			{:else}
				<p class="border-2 border-dashed border-base-content p-8 font-mono text-sm lg:col-span-7">
					Defter henüz boş: ilk sayfa yazıldığında burada duracak.
				</p>
			{/if}
		</div>
	</section>

	<!-- Tezgahtaki parçalar: 7/5 bölme — kartlar solda, açıklama sağda. -->
	<section
		class="border-t-2 border-base-content py-16 lg:py-24 {PLAN}"
		aria-labelledby="parca-baslik"
		data-plan-etiket="Parçalar · 7/5"
	>
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
			<header class="lg:order-last lg:col-span-5 lg:pl-8">
				<p class="font-mono text-xs font-bold" aria-hidden="true">§02 / PRJ</p>
				<h2
					id="parca-baslik"
					class="mt-2 font-display text-4xl leading-none font-normal sm:text-5xl"
				>
					Tezgahtaki parçalar
				</h2>
				<p class="mt-4 max-w-md text-base-content/85">
					Öne çıkardığım işler; her biri rolü, yığını ve durumu yazan bir parça etiketiyle.
				</p>
				<a href="/projeler" class="mt-4 inline-flex link items-center gap-1.5 font-semibold">
					Bütün parçalar ({data.projeSayisi})
					<ArrowRight class="size-4" aria-hidden="true" />
				</a>
			</header>
			<div class="grid grid-cols-1 items-start gap-8 sm:grid-cols-2 lg:col-span-7">
				{#each data.oneCikanlar as proje, i (proje.slug)}
					<div class={i % 2 === 1 ? 'sm:mt-12' : ''}>
						<ProjeKarti {proje} baslikSeviyesi={3} />
					</div>
				{:else}
					<p class="border-2 border-dashed border-base-content p-8 font-mono text-sm sm:col-span-2">
						Öne çıkan parça yok: projelerde <code>one_cikan: true</code> işaretlenince burada görünür.
					</p>
				{/each}
			</div>
		</div>
	</section>

	<!-- Priz paneli: vidalı koyu panel, öne çıkan bağlantılar priz olarak. -->
	<section class="pb-20 lg:pb-28" aria-labelledby="priz-baslik">
		<div
			class="relative grid grid-cols-1 gap-8 border-2 border-base-content bg-neutral p-6 text-neutral-content shadow-sert-lg sm:p-10 lg:grid-cols-12 {PLAN}"
			data-plan-etiket="Priz paneli"
		>
			<!-- Panel vidaları: yalnızca dört köşe. -->
			{#each ['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'] as konum (konum)}
				<span
					class="absolute {konum} size-2.5 rounded-full border border-neutral-content/50 bg-[linear-gradient(45deg,transparent_42%,var(--color-neutral-content)_42%_58%,transparent_58%)] opacity-60"
					aria-hidden="true"
				></span>
			{/each}
			<div class="lg:col-span-5">
				<p class="font-mono text-xs font-bold" aria-hidden="true">§03 / PRİZ</p>
				<h2 id="priz-baslik" class="mt-2 font-display text-4xl leading-none font-normal">
					Priz paneli
				</h2>
				<p class="mt-4 max-w-sm text-neutral-content/80">
					Bana ulaşmanın en kısa yolları. Diğer kablolar panelin tamamında.
				</p>
				<a
					href="/baglantilar"
					class="btn mt-6 border-2 border-neutral-content bg-transparent text-neutral-content transition-[translate,background-color] duration-150 hover:bg-neutral-content hover:text-neutral motion-reduce:transition-none"
				>
					<PlugZap class="size-4" aria-hidden="true" />
					Tüm panel
				</a>
			</div>
			<ul
				class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7"
				aria-label="Öne çıkan bağlantılar"
			>
				{#each prizler as b (b.href)}
					{@const Ikon = ikonlar[b.ikon]}
					{@const dis = disBaglanti(b.href)}
					<li>
						<a
							href={b.href}
							target={dis ? '_blank' : undefined}
							rel={dis ? 'me noopener' : undefined}
							class="group flex h-full items-center gap-4 border-2 border-base-content bg-base-100 p-4 text-base-content shadow-sert-sm transition-[translate,box-shadow] duration-150 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-content motion-reduce:transition-none"
						>
							<!-- Priz yüzü -->
							<span
								class="grid size-14 shrink-0 place-items-center rounded-full border-2 border-base-content bg-base-200 transition-colors group-hover:bg-base-300"
								aria-hidden="true"
							>
								<Ikon class="size-6" />
							</span>
							<span class="min-w-0">
								<span class="block font-display text-xl leading-tight">{b.ad}</span>
								<span class="block truncate font-mono text-xs text-base-content/75"
									>{b.kullanici}</span
								>
							</span>
							{#if dis}
								<ArrowUpRight class="ml-auto size-5 shrink-0" aria-hidden="true" />
								<span class="sr-only">(yeni sekmede açılır)</span>
							{/if}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</section>
</div>
