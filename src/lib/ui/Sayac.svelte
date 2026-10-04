<script lang="ts">
	import { Eye } from '@lucide/svelte';
	import type { CanliIcerik } from './canli.svelte';
	import { PLAN } from './tercihler.svelte';

	// Mekanik sayaç (odometre): her hane bir rakam şeridi, değer değişince yuvarlanır.
	let { canli }: { canli: CanliIcerik } = $props();

	const RAKAMLAR = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	// Her rakam 1.5rem (h-6) yüksekliğinde; şerit rakam kadar yukarı kayar.
	const KAYMA = [
		'translate-y-0',
		'-translate-y-6',
		'-translate-y-12',
		'-translate-y-18',
		'-translate-y-24',
		'-translate-y-30',
		'-translate-y-36',
		'-translate-y-42',
		'-translate-y-48',
		'-translate-y-54'
	];
	const haneler = $derived(
		String(canli.veri?.goruntulenme ?? 0)
			.padStart(4, '0')
			.split('')
			.map(Number)
	);
</script>

{#if canli.durum !== 'hata'}
	<div class="inline-flex items-center gap-2 {PLAN}" data-plan-etiket="Sayac · D1">
		<Eye class="size-4" aria-hidden="true" />
		{#if canli.durum === 'yukleniyor'}
			<span class="h-7 w-[4.75rem] skeleton" aria-label="Görüntülenme yükleniyor"></span>
		{:else}
			<span class="sr-only">{canli.veri?.goruntulenme} görüntülenme</span>
			<span
				class="flex border-2 border-base-content bg-neutral font-mono text-sm leading-none text-neutral-content tabular-nums"
				aria-hidden="true"
			>
				{#each haneler as h, i (i)}
					<span
						class="relative h-6 w-[1.15rem] overflow-hidden border-r border-neutral-content/30 last:border-r-0"
					>
						<span
							class="absolute inset-x-0 top-0 flex flex-col transition-transform duration-700 ease-out motion-reduce:transition-none {KAYMA[
								h
							]}"
						>
							{#each RAKAMLAR as r (r)}
								<span class="flex h-6 items-center justify-center">{r}</span>
							{/each}
						</span>
					</span>
				{/each}
			</span>
			<span class="font-mono text-xs">okuma</span>
		{/if}
	</div>
{/if}
