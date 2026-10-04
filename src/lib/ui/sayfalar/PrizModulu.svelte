<script lang="ts">
	import {
		ArrowUpRight,
		AtSign,
		BookOpen,
		BriefcaseBusiness,
		Check,
		CodeXml,
		Copy,
		GitBranch,
		Mail,
		Rss
	} from '@lucide/svelte';
	import { GRUPLAR, type Baglanti } from '#lib/data/baglantilar.ts';
	import { bildir } from '#lib/ui/bildirim.svelte.ts';
	import { PLAN } from '#lib/ui/tercihler.svelte.ts';

	// Priz modülü: etiketli plaka + priz yüzü + bağlantı bilgisi. `one` olanlar çift genişlikte.
	let { baglanti, kod }: { baglanti: Baglanti; kod: string } = $props();

	const IKONLAR = {
		'git-branch': GitBranch,
		'briefcase-business': BriefcaseBusiness,
		mail: Mail,
		rss: Rss,
		'at-sign': AtSign,
		'book-open': BookOpen,
		'code-xml': CodeXml
	} satisfies Record<Baglanti['ikon'], unknown>;

	const Ikon = $derived(IKONLAR[baglanti.ikon]);
	const dis = $derived(/^https?:\/\//.test(baglanti.href));
	const eposta = $derived(
		baglanti.href.startsWith('mailto:') ? baglanti.href.slice('mailto:'.length) : null
	);

	let kopyalandi = $state(false);

	async function kopyala() {
		if (!eposta) return;
		try {
			await navigator.clipboard.writeText(eposta);
			kopyalandi = true;
			bildir(`${eposta} panoya kopyalandı.`);
			setTimeout(() => (kopyalandi = false), 2000);
		} catch {
			bildir('Pano erişimi reddedildi; adresi elle seçip kopyalayabilirsin.', 'hata');
		}
	}
</script>

<article
	class="group relative flex h-full flex-col border-2 border-base-content bg-base-100 shadow-sert transition-[translate,box-shadow] duration-150 hover:translate-x-1 hover:translate-y-1 hover:shadow-none has-[a:focus-visible]:translate-x-1 has-[a:focus-visible]:translate-y-1 has-[a:focus-visible]:shadow-none has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-accent motion-reduce:transition-none motion-reduce:hover:translate-0 motion-reduce:has-[a:focus-visible]:translate-0 {PLAN}"
	data-plan-etiket="PrizModulu · {kod}"
>
	<!-- Etiket plakası -->
	<header
		class="flex items-center justify-between gap-3 border-b-2 border-base-content bg-base-200 px-4 py-1.5 font-mono text-xs"
	>
		<span class="font-bold tracking-wider">{kod} · {GRUPLAR[baglanti.grup]}</span>
		<span class="flex items-center gap-1">
			{#if dis}
				<ArrowUpRight class="size-3.5" aria-hidden="true" /> dış hat
			{:else if eposta}
				posta hattı
			{:else}
				iç hat
			{/if}
		</span>
	</header>

	<div class="flex items-start gap-5 p-5 {baglanti.one ? 'sm:gap-7 sm:p-7' : ''}">
		<!-- Priz yüzü: kare kapak, toprak klipsleri, iki delik ve ikon etiketi -->
		<span
			aria-hidden="true"
			class="relative grid shrink-0 place-items-center border-2 border-base-content bg-neutral before:absolute before:top-[6%] before:left-1/2 before:h-[7%] before:w-[24%] before:-translate-x-1/2 before:bg-neutral-content/60 after:absolute after:bottom-[6%] after:left-1/2 after:h-[7%] after:w-[24%] after:-translate-x-1/2 after:bg-neutral-content/60 {baglanti.one
				? 'size-20 sm:size-28'
				: 'size-20'}"
		>
			<span
				class="relative size-[72%] rounded-full border-2 border-neutral-content/70 bg-base-300 inset-shadow-[3px_3px_0_0] inset-shadow-base-content/30 before:absolute before:top-1/2 before:left-[20%] before:size-[17%] before:-translate-y-1/2 before:rounded-full before:bg-neutral before:transition-colors group-hover:before:bg-secondary group-has-[a:focus-visible]:before:bg-secondary after:absolute after:top-1/2 after:right-[20%] after:size-[17%] after:-translate-y-1/2 after:rounded-full after:bg-neutral after:transition-colors group-hover:after:bg-secondary group-has-[a:focus-visible]:after:bg-secondary motion-reduce:before:transition-none motion-reduce:after:transition-none"
			></span>
			<span
				class="absolute -right-2.5 -bottom-2.5 grid size-8 place-items-center border-2 border-base-content bg-primary text-primary-content"
			>
				<Ikon class="size-4" />
			</span>
		</span>

		<div class="min-w-0">
			<h3
				class="font-display leading-tight font-normal {baglanti.one
					? 'text-2xl sm:text-4xl'
					: 'text-2xl'}"
			>
				<a
					href={baglanti.href}
					class="decoration-2 underline-offset-4 group-hover:underline after:absolute after:inset-0 focus-visible:outline-none"
					target={dis ? '_blank' : undefined}
					rel={dis ? 'me noopener' : undefined}
				>
					{baglanti.ad}{#if dis}<span class="sr-only"> (yeni sekmede açılır)</span>{/if}
				</a>
			</h3>
			<p class="mt-1 font-mono text-sm break-all text-base-content/80">{baglanti.kullanici}</p>
			<p class="mt-3 leading-relaxed {baglanti.one ? 'sm:text-lg' : ''}">{baglanti.aciklama}</p>
		</div>
	</div>

	{#if eposta}
		<div
			class="relative z-10 mt-auto flex flex-wrap items-center justify-between gap-2 border-t-2 border-dashed border-base-content/40 px-5 py-3"
		>
			<span class="font-mono text-xs text-base-content/80">Adresi panoya al</span>
			<button
				type="button"
				class="btn border-2 border-base-content shadow-sert-sm btn-sm"
				onclick={kopyala}
				aria-label="{eposta} adresini kopyala"
			>
				{#if kopyalandi}
					<Check class="size-4" aria-hidden="true" /> Kopyalandı
				{:else}
					<Copy class="size-4" aria-hidden="true" /> Kopyala
				{/if}
			</button>
		</div>
	{/if}
</article>
