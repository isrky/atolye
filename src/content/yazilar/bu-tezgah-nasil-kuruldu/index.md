---
baslik: Bu tezgah nasıl kuruldu?
ozet: SvelteKit, mdsvex ve Cloudflare ile markdown'dan beslenen, canlı damgalı bir kişisel site. Parça parça.
tarih: 2026-10-04
etiketler: [SvelteKit, mdsvex, Tasarım]
ornek: true
---

<script>
	import { Not, Dipnot, Demo, Diyagram, Sekmeler } from '#lib/markdown/index.ts';
	import GolgeDemo from './GolgeDemo.svelte';

	const akis = `flowchart LR
  md[index.md] --> mdsvex --> svelte[Svelte bileşeni]
  svelte --> prerender[Derleme anında HTML]
  prerender --> cf[Cloudflare Workers]
  cf <--> d1[(D1: sayaç + damga)]`;
</script>

Bu site bir vitrin değil, bir **tezgah**. Yazılar numaralı defter sayfaları, projeler parça etiketleri, bağlantılar bir priz paneli.<Dipnot no={1}>Metafor, tasarım kararlarını kolaylaştırıyor: "Bu bir tezgahta nasıl dururdu?" sorusu çoğu tartışmayı bitiriyor.</Dipnot> Bu yazı, tezgahın kendisinin nasıl kurulduğunu anlatıyor.

<Not tur="ipucu">
Klavyede <kbd>/</kbd> ya da <kbd>⌘K</kbd> ile komut paletini açabilirsin. Gizli bir anahtar daha var: ↑↑↓↓←→←→BA.
</Not>

## Akış: markdown'dan Worker'a

Her yazı depoda `src/content/yazilar/<slug>/index.md` olarak duruyor. Derleme anında HTML'e dönüşüyor; çalışma anında yalnızca sayaçlar Worker'a uğruyor.

<Diyagram kod={akis} baslik="Yazının depodan okura yolculuğu" />

## Yazı içinde kod

```ts title="src/lib/content/slug.js"
export function slugify(metin) {
	return metin
		.replace(/[ıİşŞğĞüÜöÖçÇ]/g, (h) => harfler[h])
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-');
}
```

Birden fazla dosya gerektiğinde sekmeler:

{#snippet yapilandirma()}

```jsonc title="wrangler.jsonc"
{
	"d1_databases": [{ "binding": "DB", "database_name": "isrky" }]
}
```

{/snippet}

{#snippet goc()}

```sql title="migrations/0001_ilk.sql"
CREATE TABLE goruntulenme (anahtar TEXT PRIMARY KEY, sayi INTEGER NOT NULL DEFAULT 0);
```

{/snippet}

<Sekmeler sekmeler={[{ ad: 'wrangler.jsonc', icerik: yapilandirma }, { ad: '0001_ilk.sql', icerik: goc }]} />

## Biraz matematik

Okuma süresi kabaca $t = \lceil n / 200 \rceil$ dakika; $n$ kelime sayısı. Gölge ofsetleri ise 8px modülün kesirleri:

$$
\text{ofset} \in \{ \tfrac{1}{4}, \tfrac{1}{2}, 1 \} \times 8\,\text{px}
$$

## Canlı demo

mdsvex'in en sevdiğim yanı: yazının ortasına çalışan bir Svelte bileşeni koyabilmek.

<Demo baslik="Sert gölge ofseti">
	<GolgeDemo />
</Demo>

| Parça      | Seçim                  | Neden                               |
| ---------- | ---------------------- | ----------------------------------- |
| Çatı       | SvelteKit 3 + Svelte 5 | Runes, ön-üretim, tek dil           |
| İçerik     | mdsvex                 | Markdown içinde bileşen             |
| Barındırma | Cloudflare Workers     | Statik varlıklar + küçük API        |
| Durum      | D1                     | Sayaç ve damgalar için SQL yeterli  |

<Not tur="uyari" baslik="Örnek içerik">
Bu yazı, sitenin yapı taşlarını sergilemek için hazırlanmış bir örnek. Kendi yazılarınla değiştirebilirsin.
</Not>
