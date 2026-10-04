<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount, tick } from 'svelte';
	import {
		CornerDownLeft,
		FileText,
		Link2,
		Moon,
		PanelsTopLeft,
		Rss,
		Ruler,
		Search,
		Wrench
	} from '@lucide/svelte';
	import { ara, type AramaOgesi } from '#lib/arama.ts';
	import { bildir } from './bildirim.svelte';
	import { planDegistir, temaDegistir } from './tercihler.svelte';

	type Eylem = { tur: 'eylem'; baslik: string; aciklama: string; calistir: () => void };
	type Satir = AramaOgesi | Eylem;

	let dialog: HTMLDialogElement;
	let girdi = $state<HTMLInputElement>();
	let sorgu = $state('');
	let secili = $state(0);
	let dizin = $state<AramaOgesi[] | null>(null);
	let dizinHatasi = $state(false);

	const eylemler: Eylem[] = [
		{
			tur: 'eylem',
			baslik: 'Temayı değiştir',
			aciklama: 'Gündüz ↔ gece vardiyası',
			calistir: temaDegistir
		},
		{
			tur: 'eylem',
			baslik: 'Plan modunu aç/kapat',
			aciklama: 'Sayfanın iskeletini göster',
			calistir: planDegistir
		},
		{
			tur: 'eylem',
			baslik: 'RSS adresini kopyala',
			aciklama: 'isrky.com/rss.xml',
			calistir: async () => {
				try {
					await navigator.clipboard.writeText(`${location.origin}/rss.xml`);
					bildir('RSS adresi panoya kopyalandı.');
				} catch {
					bildir('Pano erişimi yok; adres: /rss.xml', 'hata');
				}
			}
		}
	];

	const ikonlar = {
		yazi: FileText,
		proje: Wrench,
		baglanti: Link2,
		sayfa: PanelsTopLeft,
		eylem: Ruler
	};
	const turAdi = {
		yazi: 'Yazı',
		proje: 'Proje',
		baglanti: 'Bağlantı',
		sayfa: 'Sayfa',
		eylem: 'Eylem'
	};

	const sonuclar = $derived.by((): Satir[] => {
		const icerik = dizin ? ara(dizin, sorgu) : [];
		const eslesenEylemler = sorgu.trim()
			? eylemler.filter((e) =>
					e.baslik.toLocaleLowerCase('tr').includes(sorgu.toLocaleLowerCase('tr'))
				)
			: eylemler;
		return [...icerik.slice(0, 12), ...eslesenEylemler];
	});

	$effect(() => {
		// Sorgu değişince seçim başa döner.
		void sorgu;
		secili = 0;
	});

	export async function ac() {
		if (dialog.open) return;
		dialog.showModal();
		await tick();
		girdi?.focus();
		if (!dizin) {
			try {
				const r = await fetch('/arama.json');
				if (!r.ok) throw new Error();
				dizin = await r.json();
			} catch {
				dizinHatasi = true;
			}
		}
	}

	function kapat() {
		dialog.close();
		sorgu = '';
	}

	async function sec(s: Satir | undefined) {
		if (!s) return;
		kapat();
		if (s.tur === 'eylem') s.calistir();
		else if (/^https?:/.test(s.href)) window.open(s.href, '_blank', 'noopener');
		else await goto(s.href);
	}

	function tusa(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			secili = (secili + 1) % Math.max(sonuclar.length, 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			secili = (secili - 1 + sonuclar.length) % Math.max(sonuclar.length, 1);
		} else if (e.key === 'Enter') {
			e.preventDefault();
			sec(sonuclar[secili]);
		}
	}

	onMount(() => {
		const kisayol = (e: KeyboardEvent) => {
			const yaziyor = (e.target as HTMLElement)?.closest?.('input, textarea, [contenteditable]');
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault();
				if (dialog.open) kapat();
				else ac();
			} else if (e.key === '/' && !yaziyor && !dialog.open) {
				e.preventDefault();
				ac();
			}
		};
		window.addEventListener('keydown', kisayol);
		return () => window.removeEventListener('keydown', kisayol);
	});
</script>

<dialog
	bind:this={dialog}
	class="modal modal-top sm:modal-middle"
	aria-label="Komut paleti"
	onclose={() => (sorgu = '')}
>
	<div
		class="modal-box mx-auto mt-4 w-[calc(100%-2rem)] max-w-2xl border-2 border-base-content p-0 shadow-sert-lg sm:mt-0"
	>
		<label
			class="input w-full border-0 border-b-2 border-base-content input-lg focus-within:outline-none"
		>
			<Search class="size-5" aria-hidden="true" />
			<span class="sr-only">Ara</span>
			<input
				bind:this={girdi}
				bind:value={sorgu}
				onkeydown={tusa}
				type="search"
				class="grow"
				placeholder="Yazı, proje, bağlantı ya da komut ara…"
				role="combobox"
				aria-expanded="true"
				aria-controls="palet-sonuclari"
				aria-activedescendant={sonuclar.length ? `palet-${secili}` : undefined}
				autocomplete="off"
			/>
			<kbd class="kbd kbd-sm">Esc</kbd>
		</label>

		<div class="max-h-[60vh] overflow-y-auto p-2">
			{#if !dizin && !dizinHatasi}
				<div class="space-y-2 p-2" aria-label="Dizin yükleniyor">
					<div class="h-10 w-full skeleton"></div>
					<div class="h-10 w-full skeleton"></div>
				</div>
			{:else if dizinHatasi}
				<p class="p-3 font-mono text-xs">Arama dizini yüklenemedi; komutlar yine de çalışır.</p>
			{/if}

			{#if sonuclar.length}
				<ul
					id="palet-sonuclari"
					class="menu w-full flex-nowrap"
					role="listbox"
					aria-label="Sonuçlar"
				>
					{#each sonuclar as s, i (s.baslik + s.tur)}
						{@const Ikon = ikonlar[s.tur]}
						<li role="option" class="flex-nowrap" id="palet-{i}" aria-selected={i === secili}>
							<button
								type="button"
								class="flex min-w-0 items-start gap-3 {i === secili ? 'menu-active' : ''}"
								onclick={() => sec(s)}
								onmousemove={() => (secili = i)}
								tabindex="-1"
							>
								<Ikon class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
								<span class="min-w-0 grow">
									<span class="block truncate font-semibold">{s.baslik}</span>
									<span class="block truncate text-xs opacity-75">{s.aciklama}</span>
								</span>
								<span class="badge shrink-0 badge-ghost font-mono badge-sm">{turAdi[s.tur]}</span>
							</button>
						</li>
					{/each}
				</ul>
			{:else if dizin}
				<p class="p-6 text-center text-sm">
					“{sorgu}” için tezgahta bir şey bulunamadı. Başka bir sözcük dene.
				</p>
			{/if}
		</div>

		<footer
			class="flex flex-wrap items-center gap-x-4 gap-y-1 border-t-2 border-base-content bg-base-200 px-4 py-2 font-mono text-[11px]"
		>
			<span class="flex items-center gap-1"
				><kbd class="kbd kbd-xs">↑</kbd><kbd class="kbd kbd-xs">↓</kbd> gez</span
			>
			<span class="flex items-center gap-1"
				><kbd class="kbd kbd-xs"><CornerDownLeft class="size-3" aria-hidden="true" /></kbd> aç</span
			>
			<span class="flex items-center gap-1"><Moon class="size-3" aria-hidden="true" /> tema</span>
			<span class="flex items-center gap-1"><Rss class="size-3" aria-hidden="true" /> rss</span>
		</footer>
	</div>
	<form method="dialog" class="modal-backdrop"><button>Kapat</button></form>
</dialog>
