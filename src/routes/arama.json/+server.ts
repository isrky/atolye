import { json } from '@sveltejs/kit';
import type { AramaOgesi } from '#lib/arama.ts';
import { baglantilar } from '#lib/data/baglantilar.ts';
import { gezinti } from '#lib/site.ts';
import { projeler, yazilar } from '#lib/server/icerik.ts';

export const prerender = true;

export function GET() {
	const dizin: AramaOgesi[] = [
		...yazilar.map((y) => ({
			tur: 'yazi' as const,
			baslik: y.baslik,
			aciklama: `${y.seriNo} · ${y.ozet}`,
			href: y.yol,
			ekler: [...y.etiketler, y.seri?.ad ?? ''].join(' ')
		})),
		...projeler.map((p) => ({
			tur: 'proje' as const,
			baslik: p.baslik,
			aciklama: `${p.parcaNo} · ${p.ozet}`,
			href: `/projeler/${p.slug}`,
			ekler: [...p.yigin, p.rol].join(' ')
		})),
		...baglantilar.map((b) => ({
			tur: 'baglanti' as const,
			baslik: b.ad,
			aciklama: `${b.kullanici} · ${b.aciklama}`,
			href: b.href
		})),
		...gezinti.map((g) => ({
			tur: 'sayfa' as const,
			baslik: g.etiket,
			aciklama: 'Sayfa',
			href: g.href
		}))
	];
	return json(dizin);
}
