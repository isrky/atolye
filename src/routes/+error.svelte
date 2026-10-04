<script lang="ts">
	import { page } from '$app/state';
	import { ArrowRight, House, RotateCw, Search } from '@lucide/svelte';
	import { gezinti, site } from '#lib/site.ts';
	import { paletiAc } from '#lib/ui/palet.svelte.ts';
	import { PLAN } from '#lib/ui/tercihler.svelte.ts';

	const yok = $derived(page.status === 404);
	const baslik = $derived(yok ? 'Bu parça tezgahta yok' : 'Tezgahta bir şey ters gitti');
</script>

<svelte:head>
	<title>{page.status} · {baslik} — {site.ad}</title>
	<meta name="robots" content="noindex" />
	<meta
		name="description"
		content={yok
			? 'Aradığın sayfa bu sitede bulunamadı.'
			: 'Sayfa yüklenirken beklenmedik bir hata oluştu.'}
	/>
</svelte:head>

<div
	class="mx-auto grid max-w-7xl gap-x-sutun gap-y-12 px-4 py-12 sm:px-6 sm:py-20 lg:grid-cols-12 lg:px-8"
>
	<section
		class="lg:col-span-7 {PLAN}"
		data-plan-etiket="HataPlakasi"
		aria-labelledby="hata-baslik"
	>
		<p
			class="inline-block border-2 border-base-content bg-secondary px-4 font-display text-[7rem] leading-none text-secondary-content tabular-nums shadow-sert-lg sm:text-[10rem]"
			aria-hidden="true"
		>
			{page.status}
		</p>
		<h1 id="hata-baslik" class="mt-10 font-display text-4xl leading-tight font-normal sm:text-5xl">
			<span class="sr-only">Hata {page.status}: </span>{baslik}
		</h1>

		{#if yok}
			<p class="mt-5 max-w-xl text-lg leading-relaxed">
				Bu adreste bir yazı, proje ya da sayfa yok. Bağlantı eski olabilir, parça taşınmış ya da
				adres yanlış yazılmış olabilir.
			</p>
			<p class="mt-6 font-mono text-xs font-bold tracking-wider uppercase">Aranan parça</p>
			<p
				class="mt-2 max-w-xl border-2 border-dashed border-base-content bg-base-200 px-4 py-3 font-mono text-sm break-all"
			>
				{page.url.pathname}
			</p>
		{:else}
			<p class="mt-5 max-w-xl text-lg leading-relaxed">
				Sayfa hazırlanırken beklenmedik bir hata oluştu. Bir kez daha denemek çoğu zaman yeter;
				sorun sürerse ana tezgahtan devam edebilirsin.
			</p>
			{#if page.error?.message}
				<p class="mt-6 font-mono text-xs font-bold tracking-wider uppercase">Hata kaydı</p>
				<p
					class="mt-2 max-w-xl border-2 border-dashed border-base-content bg-base-200 px-4 py-3 font-mono text-sm break-all"
				>
					{page.error.message}
				</p>
			{/if}
		{/if}

		<div class="mt-8 flex flex-wrap gap-3">
			{#if yok}
				<a
					href="/"
					class="btn border-2 border-base-content shadow-sert transition-[translate,box-shadow] duration-150 btn-primary hover:translate-x-1 hover:translate-y-1 hover:shadow-none motion-reduce:transition-none motion-reduce:hover:translate-0"
				>
					<House class="size-4" aria-hidden="true" /> Tezgaha dön
				</a>
				<button
					type="button"
					class="btn border-2 border-base-content shadow-sert-sm"
					onclick={paletiAc}
				>
					<Search class="size-4" aria-hidden="true" /> Ara <kbd class="kbd kbd-xs">⌘K</kbd>
				</button>
			{:else}
				<button
					type="button"
					class="btn border-2 border-base-content shadow-sert transition-[translate,box-shadow] duration-150 btn-primary hover:translate-x-1 hover:translate-y-1 hover:shadow-none motion-reduce:transition-none motion-reduce:hover:translate-0"
					onclick={() => location.reload()}
				>
					<RotateCw class="size-4" aria-hidden="true" /> Yeniden dene
				</button>
				<a href="/" class="btn border-2 border-base-content shadow-sert-sm">
					<House class="size-4" aria-hidden="true" /> Tezgaha dön
				</a>
			{/if}
		</div>
	</section>

	<!-- Boş parça kutusu: gidilebilecek gözler -->
	<nav
		aria-labelledby="gozler-baslik"
		class="self-end border-2 border-base-content bg-base-100 shadow-sert lg:col-span-5 {PLAN}"
		data-plan-etiket="ParcaKutusu"
	>
		<div
			class="flex items-center justify-between border-b-2 border-base-content bg-accent px-5 py-2 font-mono text-xs text-accent-content"
		>
			<h2 id="gozler-baslik" class="font-bold tracking-wider">Dolu gözler</h2>
			<span class="tabular-nums">PRC-{page.status}</span>
		</div>
		<div
			class="m-5 grid h-20 place-items-center border-2 border-dashed border-base-content/50 bg-[repeating-linear-gradient(135deg,transparent_0_10px,color-mix(in_oklch,var(--color-base-content)_8%,transparent)_10px_12px)] font-mono text-xs text-base-content/80"
		>
			{yok ? 'Bu göz boş' : 'Bu göz geçici olarak kapalı'}
		</div>
		<ul class="list">
			{#each gezinti.filter((g) => g.href !== '/') as g, i (g.href)}
				<li class="list-row items-center border-t-2 border-base-content/15">
					<span class="font-mono text-xs text-base-content/70 tabular-nums"
						>{String(i + 1).padStart(2, '0')}</span
					>
					<a href={g.href} class="link font-display text-xl font-normal link-hover">{g.etiket}</a>
					<ArrowRight class="size-4" aria-hidden="true" />
				</li>
			{/each}
		</ul>
	</nav>
</div>
