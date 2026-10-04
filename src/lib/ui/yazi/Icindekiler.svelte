<script lang="ts">
	import { ListTree } from '@lucide/svelte';
	import type { TocOgesi } from '#lib/content/sema.ts';
	import { PLAN } from '#lib/ui/tercihler.svelte.ts';

	// İçindekiler: geniş ekranda yapışkan ray, dar ekranda katlanır kutu.
	// `aktif` ve `ilerleme` sayfadan gelir; ilerleme yalnızca ölçüldüyse gösterilir.
	let {
		toc,
		aktif,
		ilerleme,
		yerlesim
	}: {
		toc: TocOgesi[];
		aktif: string | null;
		ilerleme: number | null;
		yerlesim: 'ray' | 'katlanir';
	} = $props();

	let acik = $state(false);
</script>

{#snippet liste()}
	<ul class="menu w-full menu-sm p-0">
		{#each toc as o (o.id)}
			<li class={o.seviye > 2 ? 'ml-4 border-l-2 border-base-content/20' : ''}>
				<a
					href="#{o.id}"
					class={aktif === o.id ? 'menu-active font-semibold' : ''}
					aria-current={aktif === o.id ? 'location' : undefined}
					onclick={() => (acik = false)}>{o.metin}</a
				>
			</li>
		{/each}
	</ul>
{/snippet}

{#snippet olcer()}
	{#if ilerleme !== null}
		<div class="mt-4 border-t-2 border-base-content pt-3">
			<progress class="progress h-2 w-full" value={ilerleme} max="100" aria-label="Okuma ilerlemesi"
			></progress>
			<p class="mt-1 font-mono text-xs tabular-nums">%{ilerleme} okundu</p>
		</div>
	{/if}
{/snippet}

{#if yerlesim === 'ray'}
	<nav
		class="sticky top-24 border-2 border-base-content bg-base-100 p-4 shadow-sert-sm"
		aria-label="İçindekiler"
	>
		<p class="mb-3 flex items-center gap-2 font-mono text-xs font-bold tracking-wider uppercase">
			<ListTree class="size-4" aria-hidden="true" />İçindekiler
		</p>
		{@render liste()}
		{@render olcer()}
	</nav>
{:else}
	<nav aria-label="İçindekiler" class={PLAN} data-plan-etiket="Icindekiler · katlanır">
		<details
			class="collapse-arrow collapse border-2 border-base-content bg-base-100 shadow-sert-sm"
			bind:open={acik}
		>
			<summary class="collapse-title flex items-center gap-2 font-mono text-sm font-bold">
				<ListTree class="size-4" aria-hidden="true" />
				İçindekiler
				<span class="font-normal tabular-nums">· {toc.length} başlık</span>
				{#if ilerleme !== null}
					<span class="ml-auto font-normal tabular-nums">%{ilerleme}</span>
				{/if}
			</summary>
			<div class="collapse-content">
				{@render liste()}
				{@render olcer()}
			</div>
		</details>
	</nav>
{/if}
