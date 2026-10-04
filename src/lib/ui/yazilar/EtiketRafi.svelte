<script lang="ts">
	import { Hash } from '@lucide/svelte';
	import type { Etiket } from './tipler.ts';

	// Etiket sekmeleri: defter kenarına yapıştırılmış ayraçlar gibi; seçili olan içeri basılı durur.
	let { etiketler, aktif }: { etiketler: Etiket[]; aktif?: string } = $props();
</script>

{#if etiketler.length}
	<ul class="flex flex-wrap gap-2">
		{#each etiketler as e (e.slug)}
			{@const secili = e.slug === aktif}
			<li>
				<a
					href="/yazilar/etiket/{e.slug}"
					aria-current={secili ? 'page' : undefined}
					class="btn gap-1.5 border-2 border-base-content font-mono transition-[translate,box-shadow] duration-150 btn-sm motion-reduce:transition-none {secili
						? 'translate-x-0.5 translate-y-0.5 shadow-none btn-primary'
						: 'bg-base-100 shadow-sert-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none'}"
				>
					<Hash class="size-3.5" aria-hidden="true" />{e.ad}
					<span class="badge badge-ghost border-base-content/40 badge-sm tabular-nums"
						>{e.sayi}<span class="sr-only"> yazı</span></span
					>
				</a>
			</li>
		{/each}
	</ul>
{:else}
	<p class="text-sm text-base-content/80">
		Henüz etiketlenmiş sayfa yok. Bir yazının ön bilgisine <code class="font-mono">etiketler</code> eklendiğinde
		burada ayraç olarak görünür.
	</p>
{/if}
