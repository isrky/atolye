<script lang="ts">
	import { onMount } from 'svelte';
	import {
		AtSign,
		BriefcaseBusiness,
		Cloud,
		Copy,
		ImageDown,
		MessageCircle,
		Send,
		Share2,
		Smartphone,
		X
	} from '@lucide/svelte';
	import { bildir } from '../bildirim.svelte';
	import { baglantiKopyala } from '../kopyala';

	// Paylaş: 3:4 sosyal görseli indir, telefonun paylaşım menüsüyle gönder ya da bağlantıyı paylaş.
	let {
		baslik,
		ozet,
		adres,
		gorsel,
		dosyaAdi
	}: { baslik: string; ozet: string; adres: string; gorsel: string; dosyaAdi: string } = $props();

	let dialog: HTMLDialogElement;
	let yerelPaylasim = $state(false);
	let paylasiliyor = $state(false);

	onMount(() => {
		// Dosya paylaşımı yalnızca destekleyen tarayıcılarda (çoğunlukla mobil) gösterilir.
		const deneme = new File([''], 'deneme.png', { type: 'image/png' });
		yerelPaylasim =
			typeof navigator.canShare === 'function' && navigator.canShare({ files: [deneme] });
	});

	const kodla = encodeURIComponent;
	const hedefler = $derived([
		{
			ad: 'WhatsApp',
			ikon: MessageCircle,
			href: `https://wa.me/?text=${kodla(`${baslik} ${adres}`)}`
		},
		{
			ad: 'X',
			ikon: AtSign,
			href: `https://x.com/intent/post?text=${kodla(baslik)}&url=${kodla(adres)}`
		},
		{
			ad: 'LinkedIn',
			ikon: BriefcaseBusiness,
			href: `https://www.linkedin.com/sharing/share-offsite/?url=${kodla(adres)}`
		},
		{
			ad: 'Telegram',
			ikon: Send,
			href: `https://t.me/share/url?url=${kodla(adres)}&text=${kodla(baslik)}`
		},
		{
			ad: 'Bluesky',
			ikon: Cloud,
			href: `https://bsky.app/intent/compose?text=${kodla(`${baslik} ${adres}`)}`
		}
	]);

	async function telefonlaPaylas() {
		paylasiliyor = true;
		try {
			const yanit = await fetch(gorsel);
			if (!yanit.ok) throw new Error(String(yanit.status));
			const dosya = new File([await yanit.blob()], dosyaAdi, { type: 'image/png' });
			await navigator.share({ files: [dosya], title: baslik, text: ozet, url: adres });
		} catch (e) {
			if ((e as Error).name !== 'AbortError')
				bildir('Paylaşım açılamadı; görseli indirip elle paylaşabilirsin.', 'hata');
		} finally {
			paylasiliyor = false;
		}
	}
</script>

<button
	type="button"
	class="btn gap-2 border-2 border-base-content bg-primary text-primary-content shadow-sert-sm transition-[translate,box-shadow] duration-150 btn-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none motion-reduce:transition-none"
	onclick={() => dialog.showModal()}
	aria-haspopup="dialog"
>
	<Share2 class="size-4" aria-hidden="true" />Paylaş
</button>

<dialog
	bind:this={dialog}
	class="modal modal-bottom sm:modal-middle"
	aria-labelledby="paylas-baslik"
>
	<div
		class="modal-box max-h-[92dvh] w-full max-w-3xl border-2 border-base-content p-0 shadow-sert-lg sm:w-[calc(100%-2rem)]"
	>
		<header
			class="flex items-center justify-between gap-3 border-b-2 border-base-content bg-base-200 px-5 py-3"
		>
			<h2 id="paylas-baslik" class="font-display text-xl">Bu sayfayı paylaş</h2>
			<form method="dialog">
				<button class="btn btn-square btn-ghost btn-sm" aria-label="Paylaşım penceresini kapat">
					<X class="size-5" aria-hidden="true" />
				</button>
			</form>
		</header>

		<div class="grid gap-6 p-5 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:items-start">
			<div class="mx-auto w-full max-w-60 sm:max-w-none">
				<img
					src={gorsel}
					alt="“{baslik}” için paylaşım görseli"
					width="1080"
					height="1440"
					loading="lazy"
					class="aspect-[3/4] h-auto w-full border-2 border-base-content bg-base-200 object-cover shadow-sert"
				/>
			</div>

			<div class="flex flex-col gap-5">
				<div class="flex flex-col gap-2">
					<a
						href={gorsel}
						download={dosyaAdi}
						class="btn gap-2 border-2 border-base-content shadow-sert-sm btn-primary"
					>
						<ImageDown class="size-4" aria-hidden="true" />Görseli indir
					</a>
					{#if yerelPaylasim}
						<button
							type="button"
							class="btn gap-2 border-2 border-base-content shadow-sert-sm"
							onclick={telefonlaPaylas}
							disabled={paylasiliyor}
						>
							<Smartphone class="size-4" aria-hidden="true" />
							{paylasiliyor ? 'Hazırlanıyor…' : 'Görselle paylaş'}
						</button>
					{/if}
					<button
						type="button"
						class="btn gap-2 border-2 border-base-content shadow-sert-sm"
						onclick={() => baglantiKopyala(adres)}
					>
						<Copy class="size-4" aria-hidden="true" />Bağlantıyı kopyala
					</button>
				</div>

				<section aria-labelledby="paylas-hedefler">
					<h3
						id="paylas-hedefler"
						class="mb-2 font-mono text-xs font-bold tracking-wider uppercase"
					>
						Bağlantıyla paylaş
					</h3>
					<ul class="grid grid-cols-2 gap-2 sm:grid-cols-3">
						{#each hedefler as h (h.ad)}
							<li>
								<a
									href={h.href}
									target="_blank"
									rel="noopener noreferrer"
									class="btn w-full justify-start gap-2 border-2 border-base-content btn-sm"
								>
									<h.ikon class="size-4" aria-hidden="true" />{h.ad}
									<span class="sr-only">(yeni sekmede açılır)</span>
								</a>
							</li>
						{/each}
					</ul>
				</section>

				<p class="font-mono text-[11px] leading-relaxed text-base-content/70">
					Bağlantı paylaşıldığında WhatsApp, Discord ve benzerleri sayfanın önizleme görselini
					kendiliğinden gösterir.
				</p>
			</div>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop"><button>Kapat</button></form>
</dialog>
