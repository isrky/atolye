<script lang="ts">
	import { PROJE_DURUMLARI, type Proje } from '#lib/content/sema.ts';
	import { PLAN } from './tercihler.svelte.ts';

	// Parça etiketi (datasheet): üstte delikli askı başlığı, altta teknik özellik satırları.
	let { proje, baslikSeviyesi = 3 }: { proje: Proje; baslikSeviyesi?: 2 | 3 } = $props();

	const durumRengi = {
		yayinda: 'status-success',
		devam: 'status-warning',
		arsiv: 'bg-accent-content/60'
	} as const;
</script>

<article
	class="group card relative border-2 border-base-content bg-base-100 shadow-sert transition-[translate,box-shadow] duration-150 focus-within:-translate-x-0.5 focus-within:-translate-y-0.5 focus-within:shadow-sert-lg hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-sert-lg motion-reduce:transition-none {PLAN}"
	data-plan-etiket="ProjeKarti · {proje.parcaNo}"
>
	<header
		class="flex items-center justify-between gap-3 border-b-2 border-base-content bg-accent px-5 py-2 font-mono text-xs text-accent-content"
	>
		<span class="flex items-center gap-3">
			<!-- Askı deliği -->
			<span
				class="size-3.5 rounded-full border-2 border-accent-content bg-base-100"
				aria-hidden="true"
			></span>
			<span class="font-bold tracking-wider">{proje.parcaNo}</span>
		</span>
		<span class="flex items-center gap-1.5">
			<span class="status {durumRengi[proje.durum]}" aria-hidden="true"></span>
			{PROJE_DURUMLARI[proje.durum]}
		</span>
	</header>
	<div class="card-body gap-3 p-5">
		<svelte:element
			this={`h${baslikSeviyesi}`}
			class="card-title font-display text-2xl leading-tight font-normal"
		>
			<a
				href="/projeler/{proje.slug}"
				class="decoration-2 underline-offset-4 group-focus-within:underline group-hover:underline after:absolute after:inset-0 focus-visible:outline-none"
				>{proje.baslik}</a
			>
		</svelte:element>
		<p class="leading-relaxed text-base-content/85">{proje.ozet}</p>
		<dl
			class="mt-2 grid grid-cols-[auto_1fr] border-t-2 border-dashed border-base-content/40 font-mono text-xs"
		>
			<dt class="border-b border-base-content/20 py-1.5 pr-4 font-bold uppercase">Rol</dt>
			<dd class="border-b border-base-content/20 py-1.5">{proje.rol}</dd>
			<dt class="border-b border-base-content/20 py-1.5 pr-4 font-bold uppercase">Yıl</dt>
			<dd class="border-b border-base-content/20 py-1.5 tabular-nums">{proje.yil}</dd>
			<dt class="py-1.5 pr-4 font-bold uppercase">Yığın</dt>
			<dd class="flex flex-wrap gap-1 py-1.5">
				{#each proje.yigin as y (y)}
					<span class="badge badge-ghost border-base-content/40 badge-sm">{y}</span>
				{/each}
			</dd>
		</dl>
	</div>
</article>
