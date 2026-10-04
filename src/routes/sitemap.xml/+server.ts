import { gezinti, site } from '#lib/site.ts';
import { projeler, tumEtiketler, tumSeriler, yazilar } from '#lib/server/icerik.ts';

export const prerender = true;

export function GET() {
	const yollar = [
		...gezinti.map((g) => g.href),
		...yazilar.map((y) => y.yol),
		...projeler.map((p) => `/projeler/${p.slug}`),
		...tumEtiketler.map((e) => `/yazilar/etiket/${e.slug}`),
		...tumSeriler.map((s) => `/yazilar/seri/${s.slug}`)
	];
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${yollar.map((y) => `	<url><loc>${site.url}${y}</loc></url>`).join('\n')}
</urlset>`;
	return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
}
