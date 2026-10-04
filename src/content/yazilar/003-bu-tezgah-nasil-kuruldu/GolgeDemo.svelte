<script lang="ts">
	// Yazı içi canlı demo: sert ofset gölge ne kadar "basık" hissettiriyor?
	let ofset = $state(4);
	const golgeler = ['shadow-none', 'shadow-sert-sm', 'shadow-sert', 'shadow-sert-lg'];
	const adimlar = [0, 2, 4, 8];
	const i = $derived(adimlar.indexOf(ofset));
</script>

<div class="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
	<div
		class="grid size-36 shrink-0 place-items-center border-2 border-base-content bg-primary font-display text-primary-content {golgeler[
			i
		]}"
	>
		{ofset}px
	</div>
	<fieldset class="fieldset w-full max-w-xs">
		<legend class="fieldset-legend">Gölge ofseti</legend>
		<div class="join">
			{#each adimlar as a (a)}
				<input
					type="radio"
					name="golge-ofset"
					class="btn join-item btn-sm"
					aria-label="{a}px"
					value={a}
					bind:group={ofset}
				/>
			{/each}
		</div>
		<p class="label text-wrap">
			0px düz bir kâğıt, 8px masadan kalkmış bir blok gibi durur. Sitede 2/4/8 kullanılıyor.
		</p>
	</fieldset>
</div>
