<script module lang="ts">
	// Zen yazılarının gövde yerleşimi: mdsvex /zen/ klasöründeki dosyalara bunu uygular.
	export { default as a } from './Baglanti.svelte';
	export { default as img } from './Gorsel.svelte';
</script>

<script lang="ts">
	import 'katex/dist/katex.min.css';
	import { setContext, type Snippet } from 'svelte';
	import Isikkutusu from './Isikkutusu.svelte';
	import { GORSEL_SADE } from './isikkutusu.svelte.ts';

	let { children }: { children: Snippet } = $props();

	// Gorsel ve Sekil bu bağlamı okuyup sade görünümü seçer.
	setContext(GORSEL_SADE, true);

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
	class="prose prose-lg max-w-none font-zen leading-[1.8] prose-headings:font-zen prose-headings:font-normal prose-headings:tracking-tight prose-h2:mt-16 prose-h2:text-2xl prose-h3:text-xl prose-h3:italic prose-a:decoration-1 prose-a:underline-offset-4 prose-blockquote:border-l prose-blockquote:border-base-content/30 prose-blockquote:font-normal prose-code:font-mono prose-code:break-words prose-code:before:content-none prose-code:after:content-none prose-hr:mx-auto prose-hr:w-16 prose-hr:border-base-content/30"
	onclick={kopyala}
>
	{@render children()}
</div>

<Isikkutusu sade />
