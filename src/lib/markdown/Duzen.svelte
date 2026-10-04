<script module lang="ts">
	// mdsvex bu dışa aktarımlarla düz markdown öğelerini bileşenlere çevirir.
	export { default as a } from './Baglanti.svelte';
	export { default as img } from './Gorsel.svelte';
	export { default as table } from './Tablo.svelte';
</script>

<script lang="ts">
	import 'katex/dist/katex.min.css';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	// Kod bloklarındaki "Kopyala" düğmeleri derleme anında üretilir; tıklamayı burada yakalarız.
	async function kopyala(e: MouseEvent) {
		const dugme = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-kopyala]');
		if (!dugme) return;
		const kod = dugme.closest('figure')?.querySelector('pre')?.innerText ?? '';
		try {
			await navigator.clipboard.writeText(kod);
			dugme.textContent = 'Kopyalandı ✓';
		} catch {
			dugme.textContent = 'Kopyalanamadı';
		}
		setTimeout(() => (dugme.textContent = 'Kopyala'), 1600);
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div
	class="relative prose prose-lg max-w-none prose-headings:font-display prose-headings:font-normal prose-headings:tracking-tight prose-h2:mt-14 prose-h2:text-3xl prose-h3:text-xl prose-a:decoration-2 prose-a:underline-offset-4 prose-blockquote:border-l-4 prose-blockquote:border-base-content prose-blockquote:not-italic prose-code:font-mono prose-code:break-words prose-code:before:content-none prose-code:after:content-none prose-hr:border-base-content"
	onclick={kopyala}
>
	{@render children()}
</div>
