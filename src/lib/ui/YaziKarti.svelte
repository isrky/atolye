<script lang="ts">
	import { CalendarDays, Clock, Layers } from '@lucide/svelte';
	import type { Yazi } from '#lib/content/sema.ts';
	import { tarihYaz } from '#lib/site.ts';
	import { PLAN } from './tercihler.svelte.ts';

	// Defter sayfası: delikli sol kenar, kırmızı marj çizgisi, çizgili kâğıt ve seri numarası.
	let {
		yazi,
		baslikSeviyesi = 3,
		buyuk = false
	}: { yazi: Yazi; baslikSeviyesi?: 2 | 3; buyuk?: boolean } = $props();
</script>

<article
	class="group card relative border-2 border-base-content bg-base-100 shadow-sert transition-[translate,box-shadow] duration-150 focus-within:-translate-x-0.5 focus-within:-translate-y-0.5 focus-within:shadow-sert-lg hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-sert-lg motion-reduce:transition-none {PLAN}"
	data-plan-etiket="YaziKarti · {yazi.seriNo}"
>
	<!-- Delikler ve marj çizgisi: defter metaforunun taşıyıcısı, içerik değil. -->
	<div
		class="pointer-events-none absolute inset-y-0 left-0 w-10 border-r-2 border-secondary/70 bg-[radial-gradient(circle_at_50%_50%,var(--color-base-content)_0_5px,transparent_6px)] bg-size-[40px_48px] bg-repeat-y opacity-90"
		aria-hidden="true"
	></div>
	<div
		class="card-body bg-[repeating-linear-gradient(to_bottom,transparent_0_31px,color-mix(in_oklch,var(--color-accent)_18%,transparent)_31px_32px)] py-6 pr-6 pl-16 {buyuk
			? 'gap-4 sm:py-10'
			: 'gap-3'}"
	>
		<div class="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
			<span
				class="border-2 border-base-content bg-primary px-1.5 py-0.5 font-bold text-primary-content"
				>{yazi.seriNo}</span
			>
			{#if yazi.seri}
				<span class="flex items-center gap-1"
					><Layers class="size-3.5" aria-hidden="true" />{yazi.seri.ad} · {yazi.seri.sira}. bölüm</span
				>
			{/if}
		</div>
		<svelte:element
			this={`h${baslikSeviyesi}`}
			class="card-title font-display leading-tight font-normal text-balance {buyuk
				? 'text-3xl sm:text-4xl'
				: 'text-xl sm:text-2xl'}"
		>
			<a
				href="/yazilar/{yazi.slug}"
				class="decoration-2 underline-offset-4 group-focus-within:underline group-hover:underline after:absolute after:inset-0 focus-visible:outline-none"
				>{yazi.baslik}</a
			>
		</svelte:element>
		<p
			class="text-base leading-8 text-base-content/85 {buyuk
				? 'max-w-2xl text-lg'
				: 'line-clamp-3'}"
		>
			{yazi.ozet}
		</p>
		<div class="mt-1 card-actions items-center justify-between gap-y-2 font-mono text-xs">
			<span class="flex flex-wrap items-center gap-x-4 gap-y-1">
				<span class="flex items-center gap-1"
					><CalendarDays class="size-3.5" aria-hidden="true" /><time datetime={yazi.tarih}
						>{tarihYaz(yazi.tarih)}</time
					></span
				>
				<span class="flex items-center gap-1"
					><Clock class="size-3.5" aria-hidden="true" />{yazi.okumaSuresi} dk okuma</span
				>
			</span>
			<span class="relative z-10 flex flex-wrap gap-1">
				{#each yazi.etiketler.slice(0, 3) as e (e)}
					<span class="badge badge-ghost border-base-content/40 badge-sm">#{e}</span>
				{/each}
			</span>
		</div>
	</div>
</article>
