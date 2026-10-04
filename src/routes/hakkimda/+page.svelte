<script lang="ts">
	import { ArrowRight, Download, GraduationCap, Mail, TriangleAlert } from '@lucide/svelte';
	import { hakkimda } from '#lib/data/hakkimda.ts';
	import { site } from '#lib/site.ts';
	import { PLAN } from '#lib/ui/tercihler.svelte.ts';

	const yilSayisi =
		new Date().getFullYear() -
		Number(hakkimda.deneyim.at(-1)?.baslangic ?? new Date().getFullYear());
	const iki = (n: number) => String(n).padStart(2, '0');
</script>

<svelte:head>
	<title>Hakkımda — {site.ad}</title>
	<meta
		name="description"
		content="{site.ad}: {hakkimda.ozet} Deneyim, beceriler, eğitim ve iletişim."
	/>
	<meta property="og:title" content="Hakkımda — {site.ad}" />
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
	{#if hakkimda.ornek}
		<div
			role="note"
			class="mb-10 alert border-2 border-base-content bg-warning text-warning-content shadow-sert-sm"
		>
			<TriangleAlert class="size-5 shrink-0" aria-hidden="true" />
			<p>
				<strong>Örnek içerik.</strong> Deneyim, şirketler, rakamlar ve eğitim yer tutucudur;
				<code class="font-mono text-sm">src/lib/data/hakkimda.ts</code> gerçek bilgilerle güncellenecek.
			</p>
		</div>
	{/if}

	<!-- Kimlik: 7/5 -->
	<header class="grid gap-x-sutun gap-y-10 lg:grid-cols-12 {PLAN}" data-plan-etiket="KimlikBasligi">
		<div class="lg:col-span-7">
			<h1 class="font-display text-5xl leading-[0.95] font-normal sm:text-7xl">{site.ad}</h1>
			<p class="mt-5 max-w-2xl text-xl leading-snug font-semibold">{hakkimda.ozet}</p>
			{#each hakkimda.bio as paragraf, i (i)}
				<p class="mt-4 max-w-2xl leading-relaxed text-base-content/85">{paragraf}</p>
			{/each}
			<div class="mt-8 flex flex-wrap items-center gap-3">
				<a
					href="mailto:{site.eposta}"
					class="btn border-2 border-base-content shadow-sert transition-[translate,box-shadow] duration-150 btn-primary hover:translate-x-1 hover:translate-y-1 hover:shadow-none motion-reduce:transition-none motion-reduce:hover:translate-0"
				>
					<Mail class="size-4" aria-hidden="true" /> E-posta yaz
				</a>
				{#if hakkimda.cv.hazir}
					<a href={hakkimda.cv.href} download class="btn border-2 border-base-content btn-ghost">
						<Download class="size-4" aria-hidden="true" /> Özgeçmiş (PDF)
					</a>
				{:else}
					<span class="btn btn-disabled border-2 border-dashed" aria-disabled="true">
						<Download class="size-4" aria-hidden="true" /> Özgeçmiş PDF’i hazırlanıyor
					</span>
				{/if}
			</div>
		</div>

		<dl
			class="grid grid-cols-[auto_1fr] self-start border-2 border-base-content bg-base-100 font-mono text-sm shadow-sert lg:col-span-5"
			aria-label="Kimlik plakası"
		>
			<dt
				class="border-b-2 border-base-content bg-neutral px-4 py-2 font-bold text-neutral-content uppercase"
			>
				Unvan
			</dt>
			<dd class="border-b-2 border-base-content px-4 py-2">{site.unvan}</dd>
			<dt
				class="border-b-2 border-base-content bg-neutral px-4 py-2 font-bold text-neutral-content uppercase"
			>
				Konum
			</dt>
			<dd class="border-b-2 border-base-content px-4 py-2">{site.konum}</dd>
			<dt
				class="border-b-2 border-base-content bg-neutral px-4 py-2 font-bold text-neutral-content uppercase"
			>
				Durum
			</dt>
			<dd class="flex items-center gap-2 border-b-2 border-base-content px-4 py-2">
				<span class="status status-success" aria-hidden="true"></span>{hakkimda.durum}
			</dd>
			<dt
				class="border-b-2 border-base-content bg-neutral px-4 py-2 font-bold text-neutral-content uppercase"
			>
				Deneyim
			</dt>
			<dd class="border-b-2 border-base-content px-4 py-2 tabular-nums">{yilSayisi}+ yıl</dd>
			<dt class="bg-neutral px-4 py-2 font-bold text-neutral-content uppercase">Dil</dt>
			<dd class="px-4 py-2">{hakkimda.calismaDilleri}</dd>
		</dl>
	</header>

	<!-- Gövde: 5/7 (mobilde önce deneyim) -->
	<div class="mt-20 grid gap-x-sutun gap-y-12 lg:grid-cols-12">
		<section
			aria-labelledby="deneyim"
			class="lg:col-span-7 lg:col-start-6 {PLAN}"
			data-plan-etiket="DeneyimZaman"
		>
			<h2 id="deneyim" class="mb-8 font-display text-4xl font-normal sm:text-5xl">Deneyim</h2>
			<ul class="timeline timeline-vertical timeline-compact">
				{#each hakkimda.deneyim as d, i (d.sirket + d.baslangic)}
					<li>
						{#if i > 0}<hr class="bg-base-content" />{/if}
						<div class="timeline-middle">
							<span
								class="grid size-8 place-items-center border-2 border-base-content bg-primary font-mono text-xs font-bold text-primary-content tabular-nums"
								aria-hidden="true">{iki(hakkimda.deneyim.length - i)}</span
							>
						</div>
						<article
							class="timeline-end mb-10 w-full border-2 border-base-content bg-base-100 p-5 shadow-sert-sm sm:p-6"
						>
							<p class="font-mono text-xs font-bold tracking-wider tabular-nums">
								<time datetime={d.baslangic}>{d.baslangic}</time> —
								{#if d.bitis}<time datetime={d.bitis}>{d.bitis}</time>{:else}Bugün{/if}
							</p>
							<h3 class="mt-2 font-display text-2xl leading-tight font-normal">{d.rol}</h3>
							<p class="mt-1 text-base-content/80">
								<span class="font-semibold text-base-content">{d.sirket}</span> · {d.yer}
							</p>
							<ul class="mt-4 space-y-2 border-t-2 border-dashed border-base-content/40 pt-4">
								{#each d.ciktilar as c (c)}
									<li class="flex gap-3 leading-relaxed">
										<ArrowRight class="mt-1 size-4 shrink-0" aria-hidden="true" />
										<span>{c}</span>
									</li>
								{/each}
							</ul>
						</article>
						{#if i < hakkimda.deneyim.length - 1}<hr class="bg-base-content" />{/if}
					</li>
				{/each}
			</ul>
		</section>

		<aside
			class="space-y-12 lg:col-span-5 lg:col-start-1 lg:row-start-1"
			aria-label="Beceriler ve eğitim"
		>
			<section aria-labelledby="beceriler" class={PLAN} data-plan-etiket="Beceriler">
				<h2 id="beceriler" class="mb-6 font-display text-3xl font-normal">Beceriler</h2>
				<div class="border-2 border-base-content bg-base-100 shadow-sert">
					{#each hakkimda.beceriler as g, i (g.grup)}
						<div class="p-5 {i > 0 ? 'border-t-2 border-base-content' : ''}">
							<h3 class="mb-3 font-mono text-xs font-bold tracking-wider uppercase">{g.grup}</h3>
							<ul class="flex flex-wrap gap-2">
								{#each g.ogeler as o (o)}
									<li class="badge border-2 border-base-content badge-md">{o}</li>
								{/each}
							</ul>
						</div>
					{/each}
				</div>
			</section>

			<section aria-labelledby="egitim" class={PLAN} data-plan-etiket="Egitim">
				<h2 id="egitim" class="mb-6 font-display text-3xl font-normal">Eğitim</h2>
				<ul class="list border-2 border-base-content bg-base-100">
					{#each hakkimda.egitim as e (e.okul + e.donem)}
						<li class="list-row items-center">
							<span
								class="grid size-10 place-items-center border-2 border-base-content bg-base-200"
							>
								<GraduationCap class="size-5" aria-hidden="true" />
							</span>
							<div>
								<p class="font-semibold">{e.okul}</p>
								<p class="text-sm text-base-content/80">{e.bolum}</p>
							</div>
							<span class="font-mono text-xs tabular-nums">{e.donem}</span>
						</li>
					{/each}
				</ul>
			</section>
		</aside>
	</div>

	<!-- Kapanış: iletişim -->
	<section
		aria-labelledby="iletisim"
		class="mt-20 grid gap-6 border-2 border-base-content bg-neutral p-6 text-neutral-content sm:p-10 lg:grid-cols-12 lg:items-center {PLAN}"
		data-plan-etiket="IletisimSeridi"
	>
		<div class="lg:col-span-7">
			<h2 id="iletisim" class="font-display text-3xl leading-tight font-normal sm:text-4xl">
				Tezgahta yer var. Ne kuruyoruz?
			</h2>
			<p class="mt-3 max-w-xl leading-relaxed text-neutral-content/85">
				İş birliği, danışmanlık ya da bir yazıya itiraz: e-postayla yazman yeterli, genelde iki iş
				günü içinde dönerim.
			</p>
		</div>
		<div class="flex flex-col gap-3 font-mono text-sm lg:col-span-5 lg:items-end">
			<a class="link text-lg break-all" href="mailto:{site.eposta}">{site.eposta}</a>
			<a class="flex link items-center gap-2 link-hover" href="/baglantilar">
				Diğer hatlar: priz paneli <ArrowRight class="size-4" aria-hidden="true" />
			</a>
		</div>
	</section>
</div>
