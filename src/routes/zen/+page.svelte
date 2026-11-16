<script lang="ts">
	import { site } from '#lib/site.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const aciklama = 'İşle ilgisi olmayan, acele etmeden okunsun diye yazdıklarım.';
	const gunAy = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long' });
</script>

<svelte:head>
	<title>Zen — {site.ad}</title>
	<meta name="description" content={aciklama} />
	<link rel="canonical" href="{site.url}/zen" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Zen — {site.ad}" />
	<meta property="og:description" content={aciklama} />
	<meta property="og:url" content="{site.url}/zen" />
</svelte:head>

{#snippet satir(z: PageProps['data']['sabitler'][number], solda: string, tarih?: string)}
	<li class="list-row gap-x-6 px-0 py-5">
		{#if tarih}
			<time datetime={tarih} class="w-20 pt-1 text-sm text-base-content/60 italic sm:w-24">
				{solda}
			</time>
		{:else}
			<span class="w-20 pt-1 text-sm text-base-content/60 italic sm:w-24">{solda}</span>
		{/if}
		<div>
			<a href={z.yol} class="link text-xl leading-snug link-hover">{z.baslik}</a>
			{#if z.ozet}
				<p class="mt-1.5 text-base leading-relaxed text-base-content/70">{z.ozet}</p>
			{/if}
		</div>
	</li>
{/snippet}

<div class="max-w-[62ch]">
	<h1 class="text-4xl font-normal tracking-tight sm:text-5xl">Zen</h1>
	<p class="mt-6 text-lg leading-relaxed text-base-content/80">
		İşle ilgisi olmayan yazılarım. Yürürken, beklerken, bir şey biterken aklıma gelenler; acele
		etmeden okunsun diye buraya bırakıyorum.
	</p>

	{#if data.sabitler.length}
		<section class="mt-16" aria-label="Sabit yazılar">
			<ul class="list">
				{#each data.sabitler as z (z.slug)}
					{@render satir(z, 'sabit')}
				{/each}
			</ul>
		</section>
	{/if}

	{#each data.yillar as grup, i (grup.yil)}
		<!-- Sabit yazının hemen altındaki yıl ona yakın durur; yıllar arası boşluk geniş kalır. -->
		<section
			class={i === 0 && data.sabitler.length ? 'mt-8' : 'mt-20'}
			aria-labelledby="yil-{grup.yil}"
		>
			<h2 id="yil-{grup.yil}" class="text-sm text-base-content/60 italic tabular-nums">
				{grup.yil}
			</h2>
			<ul class="list mt-3">
				{#each grup.yazilar as z (z.slug)}
					{@render satir(z, gunAy.format(new Date(z.tarih)), z.tarih)}
				{/each}
			</ul>
		</section>
	{:else}
		{#if !data.sabitler.length}
			<p class="mt-20 text-base-content/70 italic">
				Henüz bir şey yazmadım. İlk yazı geldiğinde burada, tarihiyle birlikte görünecek.
			</p>
		{/if}
	{/each}
</div>
