<script lang="ts">
	import { bildirimler } from './bildirim.svelte';
</script>

<div class="toast toast-end toast-bottom z-50" role="status" aria-live="polite">
	{#each bildirimler as b (b.id)}
		<div
			class="alert border-2 border-base-content font-mono text-sm shadow-sert {b.tur === 'hata'
				? 'alert-error'
				: 'bg-primary text-primary-content'}"
		>
			<span>{b.metin}</span>
		</div>
	{/each}
</div>
