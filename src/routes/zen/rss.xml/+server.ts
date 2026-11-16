import { site } from '#lib/site.ts';
import { zenYazilari } from '#lib/server/icerik.ts';

export const prerender = true;

const kacis = (s: string) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function GET() {
	const ogeler = zenYazilari
		.map(
			(z) => `		<item>
			<title>${kacis(z.baslik)}</title>
			<link>${site.url}${z.yol}</link>
			<guid isPermaLink="true">${site.url}${z.yol}</guid>
			<pubDate>${new Date(z.tarih).toUTCString()}</pubDate>${
				z.ozet
					? `
			<description>${kacis(z.ozet)}</description>`
					: ''
			}
		</item>`
		)
		.join('\n');
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>Zen — ${kacis(site.ad)}</title>
		<link>${site.url}/zen</link>
		<description>${kacis(site.ad)} — kişisel yazılar.</description>
		<language>tr</language>
		<atom:link href="${site.url}/zen/rss.xml" rel="self" type="application/rss+xml" />
${ogeler}
	</channel>
</rss>`;
	return new Response(xml, { headers: { 'content-type': 'application/rss+xml; charset=utf-8' } });
}
