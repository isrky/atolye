<script lang="ts">
	import { ArrowLeft, ArrowRight, Layers } from '@lucide/svelte';
	import { PLAN } from '#lib/ui/tercihler.svelte.ts';

	type Bolum = { slug: string; seriNo: string; baslik: string; sira: number };

	// Seri gezgini: serinin bütün bölümleri sırayla, bu sayfa işaretli; altta önceki/sonraki.
	let {
		seri,
		simdiki,
		onceki,
		sonraki
	}: {
		seri: { ad: string; slug: string; bolumler: Bolum[] };
		simdiki: string;
		onceki?: Bolum;
		sonraki?: Bolum;
	} = $props();

	const konum = $derived(seri.bolumler.findIndex((b) => b.slug === simdiki));
</script>

<nav
	class="border-2 border-base-content bg-base-100 p-5 shadow-sert {PLAN}"
	aria-labelledby="seri-baslik"
	data-plan-etiket="SeriGezgini"
>
	<p class="flex items-center gap-2 font-mono text-xs font-bold tracking-wider uppercase">
		<Layers class="size-4" aria-hidden="true" />Seri · {konum + 1}/{seri.bolumler.length}
	</p>
	<h2 id="seri-baslik" class="mt-1 font-display text-xl font-normal">
		<a href="/yazilar/seri/{seri.slug}" class="link decoration-2 underline-offset-4">{seri.ad}</a>
	</h2>

	<ul class="steps steps-vertical mt-3 w-full">
		{#each seri.bolumler as b, i (b.slug)}
			<li class="step {i <= konum ? 'step-primary' : ''}" data-content={b.sira}>
				<span class="flex flex-col items-start py-1 text-left">
					<span class="font-mono text-xs tabular-nums">{b.seriNo}</span>
					{#if b.slug === simdiki}
						<span class="font-semibold" aria-current="page">{b.baslik}</span>
						<span class="font-mono text-xs">← şu an bu sayfadasın</span>
					{:else}
						<a href="/yazilar/{b.slug}" class="link decoration-2 underline-offset-4">{b.baslik}</a>
					{/if}
				</span>
			</li>
		{/each}
	</ul>

	{#if onceki || sonraki}
		<div class="mt-4 grid gap-3 border-t-2 border-base-content pt-4">
			{#if onceki}
				<a
					href="/yazilar/{onceki.slug}"
					rel="prev"
					class="group flex items-start gap-3 border-2 border-base-content bg-base-200 p-3 shadow-sert-sm transition-[translate,box-shadow] duration-150 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
				>
					<ArrowLeft class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
					<span>
						<span class="block font-mono text-xs">Önceki bölüm · {onceki.seriNo}</span>
						<span class="font-semibold">{onceki.baslik}</span>
					</span>
				</a>
			{/if}
			{#if sonraki}
				<a
					href="/yazilar/{sonraki.slug}"
					rel="next"
					class="group flex items-start justify-between gap-3 border-2 border-base-content bg-primary p-3 text-primary-content shadow-sert-sm transition-[translate,box-shadow] duration-150 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
				>
					<span>
						<span class="block font-mono text-xs">Sonraki bölüm · {sonraki.seriNo}</span>
						<span class="font-semibold">{sonraki.baslik}</span>
					</span>
					<ArrowRight class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
				</a>
			{/if}
		</div>
	{/if}
</nav>
