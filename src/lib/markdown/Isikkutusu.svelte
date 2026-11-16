<script lang="ts">
	import { X } from '@lucide/svelte';
	import { isikkutusu, isikkutusuKapat, type AcikGorsel } from './isikkutusu.svelte.ts';

	// Yazı gövdesi başına bir tane: Duzen (atölye) ve ZenDuzen (sade) yerleştirir.
	let { sade = false }: { sade?: boolean } = $props();

	// Görünüm sınıfları: atölye (sert çerçeve, ofset gölge) ya da sade.
	const g = $derived(
		sade
			? {
					kutu: 'rounded-box',
					gorsel: 'rounded-field',
					altyazi: 'font-zen text-sm text-base-content/70 italic',
					kapat: 'btn btn-circle btn-sm'
				}
			: {
					kutu: 'rounded-none border-2 border-base-content shadow-sert-lg',
					gorsel: 'border-2 border-base-content',
					altyazi: 'font-mono text-xs text-base-content/75',
					kapat: 'btn btn-square border-2 border-base-content btn-sm'
				}
	);

	let dialog: HTMLDialogElement;
	// Kapanış geçişi sürerken görsel yerinde kalsın diye son açılan saklanır.
	let son = $state<AcikGorsel | null>(null);

	$effect(() => {
		const acik = isikkutusu.gorsel;
		if (!acik) return;
		son = acik;
		if (!dialog.open) dialog.showModal();
	});
</script>

<!-- Yerel <dialog>: Esc ile kapanır, odağı içeride tutar, kapanınca odağı görsele geri verir. -->
<dialog
	bind:this={dialog}
	class="modal"
	aria-label={son?.alt ? `Büyütülmüş görsel: ${son.alt}` : 'Büyütülmüş görsel'}
	onclose={isikkutusuKapat}
>
	<div
		class="modal-box flex max-h-[94dvh] w-auto max-w-[min(94%,100rem)] flex-col gap-3 bg-base-100 p-2 sm:p-3 {g.kutu}"
	>
		{#if son}
			<form method="dialog" class="flex min-h-0 justify-center">
				<button class="block min-h-0 cursor-zoom-out" aria-label="Görseli küçült">
					<picture>
						{#each son.kaynaklar as k (k.type + k.srcset)}
							<source type={k.type} srcset={k.srcset} sizes={son.sizes} />
						{/each}
						<img
							src={son.src}
							srcset={son.srcset || undefined}
							sizes={son.sizes}
							alt={son.alt}
							width={son.width}
							height={son.height}
							decoding="async"
							class="h-auto max-h-[80dvh] w-auto max-w-full bg-base-200 object-contain {g.gorsel}"
						/>
					</picture>
				</button>
			</form>
			{#if son.altyazi}
				<p class="px-1 pb-1 {g.altyazi}">{son.altyazi}</p>
			{/if}
		{/if}
	</div>
	<form method="dialog" class="modal-backdrop">
		<button tabindex="-1">Kapat</button>
	</form>
	<form method="dialog" class="fixed top-3 right-3">
		<button class={g.kapat} aria-label="Görseli kapat">
			<X class="size-4" aria-hidden="true" />
		</button>
	</form>
</dialog>
