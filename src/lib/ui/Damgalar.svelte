<script lang="ts">
	import { Coffee, Flame, FlaskConical, Lightbulb } from '@lucide/svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { fly, scale } from 'svelte/transition';
	import { SvelteSet } from 'svelte/reactivity';
	import { DAMGALAR, type DamgaTuru } from '#lib/damgalar.ts';
	import type { CanliIcerik } from './canli.svelte';
	import { PLAN } from './tercihler.svelte';

	// Lastik damgalar: her damganın kendi mürekkebi var. Basmadan önce mürekkep yastığında
	// görünür; basınca kart o renge boyanır, kâğıda iner ve köşesine "BASILDI" izi düşer.
	let { canli }: { canli: CanliIcerik } = $props();

	const damgalar = {
		aydinlatti: { ikon: Lightbulb, murekkep: 'bg-primary text-primary-content' },
		deneyecegim: { ikon: FlaskConical, murekkep: 'bg-success text-success-content' },
		kahvelik: { ikon: Coffee, murekkep: 'bg-warning text-warning-content' },
		ates: { ikon: Flame, murekkep: 'bg-error text-error-content' }
	} as const;

	// Az önce basılan damgalar: "+1" yükselir, iz düşer. Kısa süre sonra temizlenir.
	const yeniBasilan = new SvelteSet<DamgaTuru>();
	const sure = (ms: number) => (prefersReducedMotion.current ? 0 : ms);

	function bas(tur: DamgaTuru) {
		if (canli.basildi(tur)) return;
		canli.damgala(tur);
		yeniBasilan.add(tur);
		setTimeout(() => yeniBasilan.delete(tur), 700);
	}
</script>

<section
	class="border-2 border-base-content bg-base-200 p-5 shadow-sert {PLAN}"
	aria-labelledby="damga-baslik"
	data-plan-etiket="Damgalar · D1"
>
	<h2 id="damga-baslik" class="font-display text-xl">Damganı bas</h2>
	<p class="mt-1 text-sm text-base-content/75">
		Hesap yok, form yok. Her damga günde bir kez sayılır.
	</p>
	<ul class="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
		{#each DAMGALAR as d (d.tur)}
			{@const { ikon: Ikon, murekkep } = damgalar[d.tur]}
			{@const basili = canli.basildi(d.tur)}
			{@const sayi = canli.veri?.damgalar[d.tur]}
			<li>
				<button
					type="button"
					class="group relative flex w-full flex-col items-center gap-2 border-2 border-base-content px-3 pt-8 pb-4 transition-[translate,box-shadow,background-color,color] duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:cursor-not-allowed motion-reduce:transition-none
						{basili
						? `translate-x-1 translate-y-1 shadow-none ${murekkep}`
						: 'bg-base-100 shadow-sert enabled:active:translate-x-1 enabled:active:translate-y-1 enabled:active:shadow-none motion-safe:focus-visible:-translate-y-0.5 motion-safe:enabled:hover:-translate-y-0.5 motion-safe:enabled:hover:shadow-sert-lg'}"
					aria-pressed={basili}
					disabled={canli.durum !== 'hazir'}
					onclick={() => bas(d.tur)}
				>
					<!-- Mürekkep yastığı: damganın rengi basmadan önce de görünür. -->
					<span
						class="grid size-11 place-items-center border-2 border-base-content transition-[rotate,scale] duration-150 motion-safe:group-enabled:group-hover:scale-110 motion-safe:group-enabled:group-hover:-rotate-6
							{basili ? '-rotate-6 bg-base-100 text-base-content' : murekkep}"
						aria-hidden="true"
					>
						<Ikon class="size-6" />
					</span>
					<span class="font-mono text-xs font-bold tracking-wider uppercase">{d.etiket}</span>
					{#if canli.durum === 'yukleniyor'}
						<span class="h-7 w-8 skeleton"></span>
					{:else}
						<span class="relative h-7 font-display text-lg leading-7 tabular-nums">
							{#key sayi}
								<span class="block" data-sayi in:fly={{ y: 6, duration: sure(180) }}
									>{sayi ?? '—'}</span
								>
							{/key}
							{#if yeniBasilan.has(d.tur)}
								<span
									class="pointer-events-none absolute -top-1 left-full ml-1 font-mono text-sm font-bold"
									aria-hidden="true"
									in:fly={{ y: 8, duration: sure(160) }}
									out:fly={{ y: -16, duration: sure(400) }}>+1</span
								>
							{/if}
						</span>
					{/if}
					{#if basili}
						<!-- Lastik damga izi -->
						<span
							class="pointer-events-none absolute top-1.5 left-1.5 -rotate-6 border-2 border-current px-1 font-mono text-[10px] leading-4 font-bold tracking-widest"
							aria-hidden="true"
							in:scale={{ start: 1.4, duration: sure(180) }}>BASILDI</span
						>
					{/if}
					<span class="sr-only">{basili ? '(bastın)' : ''}</span>
				</button>
			</li>
		{/each}
	</ul>
	{#if canli.durum === 'hata'}
		<p class="mt-4 font-mono text-xs" role="status">
			Damga sayacına şu an ulaşılamıyor; yazı yine de burada. Sonra tekrar uğra.
		</p>
	{/if}
</section>
