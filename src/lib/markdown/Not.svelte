<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Info, Lightbulb, TriangleAlert } from '@lucide/svelte';

	type Tur = 'not' | 'ipucu' | 'uyari';
	let {
		tur = 'not',
		baslik,
		children
	}: { tur?: Tur; baslik?: string; children: Snippet } = $props();

	const turler = {
		not: { etiket: 'Not', ikon: Info, renk: 'bg-base-200 text-base-content' },
		ipucu: { etiket: 'İpucu', ikon: Lightbulb, renk: 'bg-primary text-primary-content' },
		uyari: { etiket: 'Uyarı', ikon: TriangleAlert, renk: 'bg-secondary text-secondary-content' }
	} as const;
	const t = $derived(turler[tur]);
</script>

<!-- Tezgaha yapıştırılmış not kâğıdı: üstte bant, hafif eğim. -->
<aside
	class="not-prose relative my-8 -rotate-[0.6deg] border-2 border-base-content p-5 pt-6 shadow-sert motion-reduce:rotate-0 {t.renk} before:absolute before:-top-3 before:left-1/2 before:h-5 before:w-20 before:-translate-x-1/2 before:rotate-2 before:border before:border-base-content/30 before:bg-base-100/70"
	aria-label={baslik ?? t.etiket}
>
	<p class="mb-2 flex items-center gap-2 font-mono text-xs font-bold tracking-wider uppercase">
		<t.ikon class="size-4" aria-hidden="true" />
		{baslik ?? t.etiket}
	</p>
	<div class="text-base leading-relaxed [&_a]:underline [&_code]:font-mono [&_p+p]:mt-3">
		{@render children()}
	</div>
</aside>
