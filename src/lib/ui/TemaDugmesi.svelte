<script lang="ts">
	import { Moon, Sun } from '@lucide/svelte';
	import { temaDegistir, tercihler } from './tercihler.svelte';

	const gece = $derived(tercihler.tema === 'gece-vardiyasi');
</script>

<button
	type="button"
	class="btn swap btn-square swap-rotate btn-ghost btn-sm {gece ? 'swap-active' : ''}"
	onclick={temaDegistir}
	aria-label={gece ? 'Gündüz temasına geç' : 'Gece vardiyası temasına geç'}
	title={gece ? 'Gündüz' : 'Gece vardiyası'}
>
	<Moon class="size-5 swap-on" aria-hidden="true" />
	<Sun class="size-5 swap-off" aria-hidden="true" />
</button>
