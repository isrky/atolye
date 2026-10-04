<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import { BriefcaseBusiness, GitBranch, Menu, Rss, Ruler, Search, X } from '@lucide/svelte';
	import favicon from '#lib/assets/favicon.svg';
	import { gezinti, site } from '#lib/site.ts';
	import KomutPaleti from '#lib/ui/KomutPaleti.svelte';
	import PlanModu from '#lib/ui/PlanModu.svelte';
	import Bildirimler from '#lib/ui/Bildirimler.svelte';
	import TemaDugmesi from '#lib/ui/TemaDugmesi.svelte';
	import { paletKaydet } from '#lib/ui/palet.svelte.ts';
	import { planDegistir, tercihler, tercihleriOku, PLAN } from '#lib/ui/tercihler.svelte.ts';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	let palet: KomutPaleti;
	let cekmece = $state(false);

	onMount(() => {
		tercihleriOku();
		paletKaydet(() => palet.ac());
	});
	afterNavigate(() => (cekmece = false));

	const aktif = (href: string) =>
		page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="alternate" type="application/rss+xml" title="{site.ad} — Yazılar" href="/rss.xml" />
	<meta property="og:site_name" content={site.ad} />
	<meta property="og:locale" content="tr_TR" />
	<meta property="og:image" content="{site.url}/og/varsayilan.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<a
	href="#icerik"
	class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-primary focus:p-3 focus:text-primary-content"
	>İçeriğe atla</a
>

<div class="drawer">
	<input id="cekmece" type="checkbox" class="drawer-toggle" bind:checked={cekmece} />
	<div
		class="drawer-content flex min-h-dvh flex-col bg-base-100 bg-[linear-gradient(to_right,color-mix(in_oklch,var(--color-base-content)_6%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--color-base-content)_6%,transparent)_1px,transparent_1px)] bg-size-[24px_24px] text-base-content"
	>
		<header class="sticky top-0 z-30 border-b-2 border-base-content bg-base-100">
			<nav
				class="navbar mx-auto max-w-7xl gap-2 px-4 sm:px-6 lg:px-8 {PLAN}"
				aria-label="Ana gezinti"
				data-plan-etiket="navbar"
			>
				<div class="navbar-start gap-2">
					<label
						for="cekmece"
						class="btn btn-square btn-ghost drawer-button btn-sm lg:hidden"
						aria-label="Menüyü aç"
					>
						<Menu class="size-5" aria-hidden="true" />
					</label>
					<a
						href="/"
						class="flex items-center gap-2 border-2 border-base-content bg-primary px-2 py-1 font-display text-lg leading-none text-primary-content shadow-sert-sm transition-[translate,box-shadow] duration-150 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none motion-reduce:transition-none"
						aria-label="{site.ad} — ana sayfa"
					>
						isrky<span class="font-mono text-xs font-bold" aria-hidden="true">/atölye</span>
					</a>
				</div>
				<div class="navbar-center hidden lg:flex">
					<ul class="menu menu-horizontal gap-1 font-semibold">
						{#each gezinti as g (g.href)}
							<li>
								<a
									href={g.href}
									class={aktif(g.href) ? 'menu-active bg-primary! text-primary-content!' : ''}
									aria-current={aktif(g.href) ? 'page' : undefined}>{g.etiket}</a
								>
							</li>
						{/each}
					</ul>
				</div>
				<div class="navbar-end gap-1">
					<button
						type="button"
						class="btn mr-3 gap-2 border-2 border-base-content shadow-sert-sm btn-sm"
						onclick={() => palet.ac()}
					>
						<Search class="size-4" aria-hidden="true" />
						<span class="hidden sm:inline">Ara</span>
						<kbd class="kbd hidden kbd-xs sm:inline-flex">⌘K</kbd>
					</button>
					<button
						type="button"
						class="btn btn-square btn-ghost btn-sm {tercihler.plan ? 'btn-active text-accent' : ''}"
						onclick={planDegistir}
						aria-pressed={tercihler.plan}
						aria-label="Plan modu"
						title="Plan modu (↑↑↓↓←→←→BA)"
					>
						<Ruler class="size-5" aria-hidden="true" />
					</button>
					<TemaDugmesi />
				</div>
			</nav>
		</header>

		<main id="icerik" class="grow">
			{@render children()}
		</main>

		<footer class="border-t-2 border-base-content bg-neutral text-neutral-content">
			<div class="mx-auto footer max-w-7xl gap-8 px-4 py-10 sm:footer-horizontal sm:px-6 lg:px-8">
				<aside class="max-w-sm">
					<p class="font-display text-2xl">{site.ad}</p>
					<p class="text-sm opacity-80">
						Bu tezgah açık kaynak: her yazı depoda bir markdown dosyası.
					</p>
				</aside>
				<nav aria-label="Alt gezinti">
					<h2 class="footer-title">Atölye</h2>
					{#each gezinti as g (g.href)}
						<a class="link link-hover" href={g.href}>{g.etiket}</a>
					{/each}
				</nav>
				<nav aria-label="Dış bağlantılar">
					<h2 class="footer-title">Takip</h2>
					<a class="flex link items-center gap-2 link-hover" href="/rss.xml"
						><Rss class="size-4" aria-hidden="true" /> RSS</a
					>
					<a
						class="flex link items-center gap-2 link-hover"
						href={site.sosyal.github}
						rel="me noopener"
						target="_blank"><GitBranch class="size-4" aria-hidden="true" /> GitHub</a
					>
					<a
						class="flex link items-center gap-2 link-hover"
						href={site.sosyal.linkedin}
						rel="me noopener"
						target="_blank"><BriefcaseBusiness class="size-4" aria-hidden="true" /> LinkedIn</a
					>
				</nav>
			</div>
			<p class="mx-auto max-w-7xl px-4 pb-6 font-mono text-[11px] opacity-70 sm:px-6 lg:px-8">
				© {new Date().getFullYear()}
				{site.ad} · <a class="link" href={site.depo} target="_blank" rel="noopener">kaynak kodu</a>
				·
				<kbd class="kbd kbd-xs text-base-content">/</kbd> ile ara
			</p>
		</footer>
	</div>

	<div class="drawer-side z-40">
		<label for="cekmece" aria-label="Menüyü kapat" class="drawer-overlay"></label>
		<aside
			class="flex min-h-full w-72 flex-col border-r-2 border-base-content bg-base-100 p-4 text-base-content"
		>
			<div class="mb-4 flex items-center justify-between">
				<span class="font-display text-lg">Atölye</span>
				<label for="cekmece" class="btn btn-square btn-ghost btn-sm" aria-label="Menüyü kapat">
					<X class="size-5" aria-hidden="true" />
				</label>
			</div>
			<ul class="menu w-full text-base font-semibold">
				{#each gezinti as g (g.href)}
					<li>
						<a
							href={g.href}
							class={aktif(g.href) ? 'menu-active bg-primary! text-primary-content!' : ''}
							>{g.etiket}</a
						>
					</li>
				{/each}
			</ul>
		</aside>
	</div>
</div>

<KomutPaleti bind:this={palet} />
<PlanModu />
<Bildirimler />
