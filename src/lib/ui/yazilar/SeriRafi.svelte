<script lang="ts">
	import { ChevronRight, Layers } from '@lucide/svelte';
	import type { Seri } from './tipler.ts';

	// Seriler: her seri kendi bölüm adımlarıyla, defterde zımbalanmış bir ek gibi.
	let { seriler }: { seriler: Seri[] } = $props();
</script>

{#if seriler.length}
	<ul class="flex flex-col gap-4">
		{#each seriler as s (s.slug)}
			<li class="border-2 border-base-content bg-base-100 p-4 shadow-sert-sm">
				<div class="flex flex-wrap items-baseline justify-between gap-2">
					<h3 class="flex items-center gap-2 font-display text-lg font-normal">
						<Layers class="size-4 shrink-0" aria-hidden="true" />{s.ad}
					</h3>
					<span class="font-mono text-xs tabular-nums">{s.yazilar.length} bölüm</span>
				</div>
				<ul class="steps steps-vertical mt-2 w-full">
					{#each s.yazilar as y (y.slug)}
						<li class="step" data-content={y.seri?.sira}>
							<a
								href="/yazilar/{y.slug}"
								class="link text-start text-sm leading-snug link-hover decoration-2 underline-offset-4"
								>{y.baslik}</a
							>
						</li>
					{/each}
				</ul>
				<a
					href="/yazilar/seri/{s.slug}"
					class="mt-2 inline-flex link items-center gap-1 font-mono text-xs font-bold decoration-2 underline-offset-4"
					>Serinin tamamı<ChevronRight class="size-3.5" aria-hidden="true" /></a
				>
			</li>
		{/each}
	</ul>
{:else}
	<p class="text-sm text-base-content/80">
		Henüz çok bölümlü bir seri yok. Bir konu tek sayfaya sığmadığında bölümleri burada sırayla
		toplanır.
	</p>
{/if}
