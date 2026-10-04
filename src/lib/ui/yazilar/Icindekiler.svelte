<script lang="ts">
	import { Clock } from '@lucide/svelte';
	import type { Yazi } from '#lib/content/sema.ts';
	import { tarihYaz } from '#lib/site.ts';
	import { PLAN } from '#lib/ui/tercihler.svelte.ts';

	// Defterin içindekiler sayfası: solda seri numarası, başlıktan tarihe noktalı kılavuz çizgisi.
	let {
		yazilar,
		etiket,
		bolum = false,
		baslikSeviyesi = 3
	}: {
		yazilar: Yazi[];
		/** Listenin erişilebilir adı. */
		etiket: string;
		/** Seri sayfası: numara sütununda bölüm sırası da yazar. */
		bolum?: boolean;
		baslikSeviyesi?: 2 | 3;
	} = $props();
</script>

<ol
	class="list border-2 border-base-content bg-base-100 shadow-sert {PLAN}"
	aria-label={etiket}
	data-plan-etiket="Icindekiler · {yazilar.length} satır"
>
	{#each yazilar as y (y.slug)}
		<li
			class="group list-row relative items-start gap-x-3 rounded-none px-3 py-5 transition-colors duration-150 focus-within:bg-base-200 hover:bg-base-200 motion-reduce:transition-none sm:gap-x-5 sm:px-5"
		>
			<span class="flex flex-col items-start gap-1 pt-1 font-mono text-xs font-bold tabular-nums">
				<span
					class="border-2 border-base-content bg-base-100 px-1.5 py-0.5 shadow-sert-sm transition-[translate,box-shadow,background-color] duration-150 group-focus-within:translate-x-0.5 group-focus-within:translate-y-0.5 group-focus-within:bg-primary group-focus-within:text-primary-content group-focus-within:shadow-none group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:bg-primary group-hover:text-primary-content group-hover:shadow-none motion-reduce:transition-none"
					>{y.seriNo}</span
				>
				{#if bolum && y.seri}
					<span class="text-base-content/70">{y.seri.sira}. bölüm</span>
				{/if}
			</span>
			<div class="flex min-w-0 flex-col gap-2">
				<div class="flex items-baseline gap-3">
					<svelte:element
						this={`h${baslikSeviyesi}`}
						class="min-w-0 font-display text-lg leading-snug font-normal text-balance sm:text-xl"
					>
						<a
							href={y.yol}
							class="decoration-2 underline-offset-4 group-hover:underline after:absolute after:inset-0 focus-visible:underline focus-visible:outline-none"
							>{y.baslik}</a
						>
					</svelte:element>
					<span
						class="hidden min-w-8 flex-1 border-b-2 border-dotted border-base-content/50 sm:block"
						aria-hidden="true"
					></span>
					<time datetime={y.tarih} class="hidden shrink-0 font-mono text-xs tabular-nums sm:inline"
						>{tarihYaz(y.tarih)}</time
					>
				</div>
				<p class="line-clamp-2 max-w-2xl text-sm leading-6 text-base-content/80">{y.ozet}</p>
				<div
					class="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-base-content/80"
				>
					<time datetime={y.tarih} class="tabular-nums sm:hidden">{tarihYaz(y.tarih)}</time>
					<span class="flex items-center gap-1 tabular-nums"
						><Clock class="size-3.5" aria-hidden="true" />{y.okumaSuresi} dk</span
					>
					{#each y.etiketler as e (e)}
						<span>#{e}</span>
					{/each}
				</div>
			</div>
		</li>
	{/each}
</ol>
