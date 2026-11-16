<script lang="ts">
	import { ArrowLeft } from '@lucide/svelte';
	import { page } from '$app/state';

	const yok = $derived(page.status === 404);
</script>

<svelte:head>
	<title>{yok ? 'Böyle bir yazı yok' : 'Bir şey ters gitti'} — Zen</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="max-w-[62ch]" aria-labelledby="zen-hata">
	<h1 id="zen-hata" class="text-4xl leading-[1.15] font-normal tracking-tight sm:text-5xl">
		<span class="sr-only">Hata {page.status}: </span>
		{yok ? 'Bu sayfa boş.' : 'Bir şey ters gitti.'}
	</h1>
	<p class="mt-6 text-lg leading-relaxed text-base-content/80">
		{#if yok}
			Bu adreste bir yazı yok. Adres yanlış yazılmış ya da yazı kaldırılmış olabilir.
		{:else}
			Sayfa hazırlanırken beklenmedik bir hata oluştu. Biraz sonra yeniden denemek çoğu zaman yeter.
		{/if}
	</p>
	<p class="mt-3 text-sm break-all text-base-content/60 italic">{page.url.pathname}</p>
	<a href="/zen" class="mt-12 inline-flex link items-center gap-2 text-sm link-hover">
		<ArrowLeft class="size-4" aria-hidden="true" />Tüm yazılar
	</a>
</section>
