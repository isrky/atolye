import { site } from '#lib/site.ts';
import { yazilar } from '#lib/server/icerik.ts';

export const prerender = true;

const kacis = (s: string) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function GET() {
	const ogeler = yazilar
		.map(
			(y) => `		<item>
			<title>${kacis(y.baslik)}</title>
			<link>${site.url}/yazilar/${y.slug}</link>
			<guid isPermaLink="true">${site.url}/yazilar/${y.slug}</guid>
			<pubDate>${new Date(y.tarih).toUTCString()}</pubDate>
			<description>${kacis(y.ozet)}</description>
${y.etiketler.map((e) => `			<category>${kacis(e)}</category>`).join('\n')}
		</item>`
		)
		.join('\n');
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>${kacis(site.ad)} — Yazılar</title>
		<link>${site.url}</link>
		<description>${kacis(site.aciklama)}</description>
		<language>tr</language>
		<atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml" />
${ogeler}
	</channel>
</rss>`;
	return new Response(xml, { headers: { 'content-type': 'application/rss+xml; charset=utf-8' } });
}
