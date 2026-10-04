<script lang="ts">
	import type { Snippet } from 'svelte';
	import { PROJE_DURUMLARI, type Proje } from '#lib/content/sema.ts';
	import { PLAN } from '#lib/ui/tercihler.svelte.ts';

	// Mühendislik datasheet'i: koyu başlık şeridi, ölçü çizgili özellik tablosu, altta canlı ölçüm yuvası.
	let { proje, alt }: { proje: Proje; alt?: Snippet } = $props();

	const durumRengi = {
		yayinda: 'status-success',
		devam: 'status-warning',
		arsiv: 'bg-base-content/60'
	} as const;
</script>

<section
	class="min-w-0 border-2 border-base-content bg-base-100 shadow-sert-lg {PLAN}"
	aria-labelledby="datasheet-baslik"
	data-plan-etiket="Datasheet · {proje.parcaNo}"
>
	<header
		class="flex items-center justify-between gap-3 border-b-2 border-base-content bg-neutral px-5 py-2.5 font-mono text-xs text-neutral-content"
	>
		<h2 id="datasheet-baslik" class="font-bold tracking-wider uppercase">Datasheet</h2>
		<span class="tabular-nums">{proje.parcaNo} · rev. {proje.yil}</span>
	</header>
	<div class="max-w-full overflow-x-auto">
		<table class="table table-sm font-mono text-sm">
			<caption class="sr-only">{proje.baslik} için teknik özellikler</caption>
			<tbody
				class="[&_th]:w-28 [&_th]:border-r-2 [&_th]:border-dashed [&_th]:border-base-content/40 [&_th]:bg-base-200 [&_th]:align-top [&_th]:text-xs [&_th]:font-bold [&_th]:tracking-wider [&_th]:uppercase [&_tr]:border-base-content/20"
			>
				<tr>
					<th scope="row">Rol</th>
					<td>{proje.rol}</td>
				</tr>
				<tr>
					<th scope="row">Yıl</th>
					<td class="tabular-nums">{proje.yil}</td>
				</tr>
				<tr>
					<th scope="row">Durum</th>
					<td>
						<span class="inline-flex items-center gap-2">
							<span class="status status-md {durumRengi[proje.durum]}" aria-hidden="true"></span>
							{PROJE_DURUMLARI[proje.durum]}
						</span>
					</td>
				</tr>
				<tr>
					<th scope="row">Yığın</th>
					<td>
						<ul class="flex flex-wrap gap-1.5" aria-label="Kullanılan teknolojiler">
							{#each proje.yigin as y (y)}
								<li class="badge badge-ghost border-base-content badge-sm">{y}</li>
							{/each}
						</ul>
					</td>
				</tr>
				<tr>
					<th scope="row">Okuma</th>
					<td class="tabular-nums">~{proje.okumaSuresi} dk</td>
				</tr>
			</tbody>
		</table>
	</div>
	{#if alt}
		<footer class="border-t-2 border-base-content bg-base-200 px-5 py-3">
			{@render alt()}
		</footer>
	{/if}
</section>
