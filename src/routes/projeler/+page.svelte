<script lang="ts">
	import { onMount } from 'svelte';
	import { replaceState } from '$app/navigation';
	import { PackageSearch, RotateCcw } from '@lucide/svelte';
	import { site } from '#lib/site.ts';
	import { PROJE_DURUMLARI, type ProjeDurumu } from '#lib/content/sema.ts';
	import ProjeKarti from '#lib/ui/ProjeKarti.svelte';
	import { PLAN } from '#lib/ui/tercihler.svelte.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const DURUMLAR = Object.keys(PROJE_DURUMLARI) as ProjeDurumu[];
	const durumRengi = {
		yayinda: 'status-success',
		devam: 'status-warning',
		arsiv: 'bg-base-content/60'
	} as const;

	// Yığın seçenekleri: en çok kullanılan teknoloji önce, eşitlikte alfabetik.
	const yiginlar = $derived.by(() => {
		// Türetilmiş hesap içinde geçici; reaktif olması gerekmiyor.
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const sayim = new Map<string, number>();
		for (const p of data.projeler) for (const y of p.yigin) sayim.set(y, (sayim.get(y) ?? 0) + 1);
		return [...sayim].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'tr')).map(([y]) => y);
	});
	const durumSayisi = $derived(
		Object.fromEntries(
			DURUMLAR.map((d) => [d, data.projeler.filter((p) => p.durum === d).length])
		) as Record<ProjeDurumu, number>
	);

	let durum = $state<ProjeDurumu | null>(null);
	let yigin = $state<string | null>(null);
	let hazir = false;

	const suzulmus = $derived(
		data.projeler.filter(
			(p) => (!durum || p.durum === durum) && (!yigin || p.yigin.includes(yigin))
		)
	);
	const filtreVar = $derived(durum !== null || yigin !== null);

	// 7/5 ritmi: her çiftte öne çıkan parça geniş yuvaya oturur; yoksa satırlar 7/5 ↔ 5/7 değişir.
	const GENISLIK = { 7: 'lg:col-span-7', 5: 'lg:col-span-5' } as const;
	const yuvalar = $derived.by(() => {
		const sonuc: (7 | 5)[] = [];
		for (let i = 0; i < suzulmus.length; i += 2) {
			const [a, b] = [suzulmus[i], suzulmus[i + 1]];
			const ciftSatir = (i / 2) % 2 === 0;
			if (!b) sonuc.push(ciftSatir ? 7 : 5);
			else if (a.oneCikan !== b.oneCikan) sonuc.push(a.oneCikan ? 7 : 5, a.oneCikan ? 5 : 7);
			else sonuc.push(ciftSatir ? 7 : 5, ciftSatir ? 5 : 7);
		}
		return sonuc;
	});
	const bosYuva = $derived(!filtreVar && suzulmus.length % 2 === 1);
	const sonrakiNo = $derived(`PRJ-${String(data.projeler.length + 1).padStart(3, '0')}`);

	const ozetMetni = $derived.by(() => {
		const parcalar = [
			durum && `durum “${PROJE_DURUMLARI[durum]}”`,
			yigin && `yığın “${yigin}”`
		].filter(Boolean);
		return parcalar.join(' ve ');
	});

	function sifirla() {
		durum = null;
		yigin = null;
	}

	// Filtreler adres çubuğunda yaşar: paylaşılan bağlantı aynı rafı açar.
	onMount(() => {
		const q = new URLSearchParams(location.search);
		const d = q.get('durum');
		const y = q.get('yigin');
		if (d && d in PROJE_DURUMLARI) durum = d as ProjeDurumu;
		if (y && yiginlar.includes(y)) yigin = y;
		hazir = true;
	});

	$effect(() => {
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const q = new URLSearchParams();
		if (durum) q.set('durum', durum);
		if (yigin) q.set('yigin', yigin);
		if (!hazir) return;
		const arama = q.size ? `?${q}` : '';
		if (arama !== location.search) replaceState(`/projeler${arama}`, {});
	});
</script>

<svelte:head>
	<title>Projeler — {site.ad}</title>
	<meta
		name="description"
		content="Parça rafı: {site.ad}’nın projeleri; her biri rolü, yılı, durumu ve yığınıyla bir datasheet etiketi."
	/>
	<link rel="canonical" href="{site.url}/projeler" />
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
	<header class="grid items-end gap-8 lg:grid-cols-12 {PLAN}" data-plan-etiket="RafBasligi · 7/5">
		<div class="lg:col-span-7">
			<h1 class="font-display text-5xl leading-none font-normal tracking-tight sm:text-7xl">
				Parça rafı
			</h1>
			<p class="mt-5 max-w-xl text-lg leading-relaxed text-base-content/85">
				Projelerim tezgahta etiketli parçalar gibi duruyor: her birinin parça numarası, rolüm, yılı
				ve yığını var. Durumuna ya da kullandığı teknolojiye göre süz.
			</p>
		</div>
		<div class="lg:col-span-5">
			<div
				class="stats w-full border-2 border-base-content bg-base-100 shadow-sert {PLAN}"
				data-plan-etiket="RafSayimi"
			>
				{#each DURUMLAR as d (d)}
					<div class="stat px-4 py-3">
						<div
							class="stat-title flex items-center gap-1.5 font-mono text-xs text-base-content/80"
						>
							<span class="status {durumRengi[d]}" aria-hidden="true"></span>
							{PROJE_DURUMLARI[d]}
						</div>
						<div class="stat-value font-display text-3xl font-normal tabular-nums">
							{String(durumSayisi[d]).padStart(2, '0')}
						</div>
					</div>
				{/each}
			</div>
			<p class="mt-3 font-mono text-xs text-base-content/75">
				Rafta toplam <span class="font-bold tabular-nums">{data.projeler.length}</span> parça
			</p>
		</div>
	</header>

	<section
		class="mt-12 border-2 border-base-content bg-base-200 p-4 sm:p-5 {PLAN}"
		aria-label="Rafı süz"
		data-plan-etiket="RafFiltresi"
	>
		<div class="grid gap-5 lg:grid-cols-12">
			<div class="lg:col-span-5">
				<p id="durum-etiket" class="mb-2 font-mono text-xs font-bold tracking-wider uppercase">
					Durum
				</p>
				<form class="filter gap-y-2" aria-labelledby="durum-etiket" onreset={() => (durum = null)}>
					<input
						class="btn btn-square border-base-content btn-sm"
						type="reset"
						value="×"
						aria-label="Durum filtresini sıfırla"
					/>
					{#each DURUMLAR as d (d)}
						<input
							class="btn border-base-content btn-sm checked:border-base-content checked:bg-primary checked:text-primary-content checked:shadow-sert-sm"
							type="radio"
							name="proje-durum"
							value={d}
							aria-label={PROJE_DURUMLARI[d]}
							checked={durum === d}
							onchange={() => (durum = d)}
						/>
					{/each}
				</form>
			</div>
			<div class="lg:col-span-7">
				<p id="yigin-etiket" class="mb-2 font-mono text-xs font-bold tracking-wider uppercase">
					Yığın
				</p>
				<form class="filter gap-y-2" aria-labelledby="yigin-etiket" onreset={() => (yigin = null)}>
					<input
						class="btn btn-square border-base-content btn-sm"
						type="reset"
						value="×"
						aria-label="Yığın filtresini sıfırla"
					/>
					{#each yiginlar as y (y)}
						<input
							class="btn border-base-content font-mono font-normal btn-sm checked:border-base-content checked:bg-primary checked:text-primary-content checked:shadow-sert-sm"
							type="radio"
							name="proje-yigin"
							value={y}
							aria-label={y}
							checked={yigin === y}
							onchange={() => (yigin = y)}
						/>
					{/each}
				</form>
			</div>
		</div>
		<p
			class="mt-4 border-t-2 border-dashed border-base-content/40 pt-3 font-mono text-xs"
			role="status"
		>
			<span class="font-bold tabular-nums">{suzulmus.length}</span> /
			<span class="tabular-nums">{data.projeler.length}</span>
			parça gösteriliyor{#if filtreVar}&nbsp;<span>· süzgeç: {ozetMetni}</span>{/if}
		</p>
	</section>

	{#if suzulmus.length}
		<ul
			class="mt-10 grid gap-8 lg:grid-cols-12 {PLAN}"
			aria-label="Projeler"
			data-plan-etiket="ParcaRafi · 12 kolon"
		>
			{#each suzulmus as proje, i (proje.slug)}
				<li class="grid {GENISLIK[yuvalar[i]]}">
					<ProjeKarti {proje} baslikSeviyesi={2} />
				</li>
			{/each}
			{#if bosYuva}
				<li
					class="hidden flex-col justify-center gap-2 border-2 border-dashed border-base-content/40 p-6 font-mono text-xs text-base-content/70 lg:flex {GENISLIK[
						yuvalar[yuvalar.length - 1] === 7 ? 5 : 7
					]}"
					aria-hidden="true"
				>
					<span class="font-bold tracking-wider">BOŞ YUVA · {sonrakiNo}</span>
					<span>Sıradaki parça henüz tezgahta.</span>
				</li>
			{/if}
		</ul>
	{:else}
		<section
			class="mt-10 flex flex-col items-start gap-4 border-2 border-dashed border-base-content bg-base-100 p-8 sm:p-10 {PLAN}"
			aria-labelledby="bos-raf-baslik"
			data-plan-etiket="BosRaf"
		>
			<PackageSearch class="size-10" aria-hidden="true" />
			<h2 id="bos-raf-baslik" class="font-display text-3xl font-normal">
				Bu rafta eşleşen parça yok
			</h2>
			<p class="max-w-xl leading-relaxed text-base-content/85">
				Hiçbir projede {ozetMetni} birlikte bulunmuyor. Süzgeçlerden birini kaldır ya da rafın tamamına
				geri dön.
			</p>
			<button
				type="button"
				class="btn border-base-content shadow-sert-sm transition-[translate,box-shadow] duration-150 btn-primary hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none motion-reduce:transition-none"
				onclick={sifirla}
			>
				<RotateCcw class="size-4" aria-hidden="true" />
				Süzgeçleri sıfırla
			</button>
		</section>
	{/if}
</div>
