<script lang="ts">
	import { GRUPLAR, baglantilar, type Baglanti } from '#lib/data/baglantilar.ts';
	import { site } from '#lib/site.ts';
	import { PLAN } from '#lib/ui/tercihler.svelte.ts';
	import PrizModulu from '#lib/ui/sayfalar/PrizModulu.svelte';

	const numarali = baglantilar.map((b, i) => ({
		...b,
		kod: `P-${String(i + 1).padStart(2, '0')}`
	}));

	// GRUPLAR sırasıyla hatlar; boş hat gösterilmez.
	const hatlar = (Object.keys(GRUPLAR) as Baglanti['grup'][])
		.map((anahtar) => ({
			anahtar,
			ad: GRUPLAR[anahtar],
			ogeler: numarali.filter((b) => b.grup === anahtar)
		}))
		.filter((h) => h.ogeler.length > 0)
		.map((h, i) => ({
			...h,
			no: String(i + 1).padStart(2, '0'),
			genis: h.ogeler.some((b) => b.one)
		}));

	const vida =
		'absolute size-3.5 rounded-full border-2 border-base-content bg-base-100 bg-[linear-gradient(45deg,transparent_42%,var(--color-base-content)_42%,var(--color-base-content)_58%,transparent_58%)]';
</script>

<svelte:head>
	<title>Bağlantılar — {site.ad}</title>
	<meta
		name="description"
		content="{site.ad} nerede: GitHub, LinkedIn, e-posta ve RSS tek bir priz panelinde."
	/>
	<meta property="og:title" content="Bağlantılar — {site.ad}" />
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
	<header
		class="grid gap-x-sutun gap-y-8 lg:grid-cols-12 lg:items-end {PLAN}"
		data-plan-etiket="PanelBasligi"
	>
		<div class="lg:col-span-7">
			<div class="flex items-center gap-5">
				<div class="avatar avatar-placeholder shrink-0">
					<div
						class="size-16 border-2 border-base-content bg-primary text-primary-content shadow-sert sm:size-20"
					>
						<span class="font-display text-2xl sm:text-3xl" aria-hidden="true">İS</span>
					</div>
				</div>
				<h1 class="font-display text-4xl leading-[0.95] font-normal sm:text-6xl">{site.ad}</h1>
			</div>
			<p class="mt-5 font-mono text-sm">{site.unvan} · {site.konum}</p>
			<p class="mt-4 max-w-xl text-lg leading-relaxed">
				Beni bulabileceğin her hat bu panelde. Fişi hangisine takarsan tak, karşı uçta ben varım.
			</p>
		</div>

		<dl
			class="grid grid-cols-[auto_1fr] border-2 border-base-content bg-neutral font-mono text-sm text-neutral-content shadow-sert lg:col-span-5"
		>
			<dt class="border-b border-neutral-content/25 px-4 py-2 font-bold uppercase">Panel</dt>
			<dd class="border-b border-neutral-content/25 px-4 py-2">PRZ-01 · priz paneli</dd>
			<dt class="border-b border-neutral-content/25 px-4 py-2 font-bold uppercase">Priz</dt>
			<dd class="border-b border-neutral-content/25 px-4 py-2 tabular-nums">
				{numarali.length} modül
			</dd>
			<dt class="border-b border-neutral-content/25 px-4 py-2 font-bold uppercase">Hat</dt>
			<dd class="border-b border-neutral-content/25 px-4 py-2 tabular-nums">
				{hatlar.length} grup
			</dd>
			<dt class="px-4 py-2 font-bold uppercase">Kaynak</dt>
			<dd class="px-4 py-2 break-all">src/lib/data/baglantilar.ts</dd>
		</dl>
	</header>

	<!-- Panel şasisi: dört köşede vida, içinde gruplu hatlar -->
	<section
		aria-label="Bağlantı hatları"
		class="relative mt-14 border-2 border-base-content bg-base-300 px-4 pt-10 pb-8 shadow-sert-lg sm:px-8 sm:pb-10 {PLAN}"
		data-plan-etiket="PrizPaneli"
	>
		<span class="{vida} top-2 left-2" aria-hidden="true"></span>
		<span class="{vida} top-2 right-2" aria-hidden="true"></span>
		<span class="{vida} bottom-2 left-2" aria-hidden="true"></span>
		<span class="{vida} right-2 bottom-2" aria-hidden="true"></span>

		<div class="grid gap-x-8 gap-y-10 lg:grid-cols-12">
			{#each hatlar as hat (hat.anahtar)}
				<section
					aria-labelledby="hat-{hat.anahtar}"
					class={hat.genis ? 'lg:col-span-7' : 'lg:col-span-5'}
				>
					<h2 id="hat-{hat.anahtar}" class="mb-4 flex items-center gap-3">
						<span
							class="bg-base-content px-1.5 font-mono text-xs leading-5 font-bold text-base-100 tabular-nums"
							>HAT {hat.no}</span
						>
						<span class="font-display text-xl font-normal">{hat.ad}</span>
						<span class="grow border-t-2 border-dashed border-base-content/40" aria-hidden="true"
						></span>
					</h2>
					<ul class="grid gap-6 {hat.ogeler.length > 1 ? 'sm:grid-cols-2' : ''}">
						{#each hat.ogeler as b (b.href)}
							<li class={b.one && hat.ogeler.length > 1 ? 'sm:col-span-2' : ''}>
								<PrizModulu baglanti={b} kod={b.kod} />
							</li>
						{/each}
					</ul>
				</section>
			{/each}
		</div>
	</section>

	<p class="mt-8 max-w-2xl font-mono text-xs leading-relaxed text-base-content/80">
		Panel, depodaki tek bir veri dosyasından kurulur; yeni bir hat eklemek bir satırlık değişiklik.
		Daha uzun hikâye için <a class="link" href="/hakkimda">Hakkımda</a> sayfasına bak.
	</p>
</div>
