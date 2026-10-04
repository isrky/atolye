---
baslik: "Canlı sayaçlar I: D1 ile çerezsiz görüntülenme"
ozet: Ham IP saklamadan, günlük tuzlanmış özetlerle tekil görüntülenme saymak.
tarih: 2026-09-21
etiketler: [Cloudflare, D1, Gizlilik]
seri: { ad: Canlı sayaçlar, sira: 1 }
ornek: true
---

<script>
	import { Not } from '#lib/markdown/index.ts';
</script>

Görüntülenme saymak kolay; **aynı kişiyi iki kez saymamak** ve bunu yaparken kimseyi izlememek zor.

## Günlük tuz

Ziyaretçi kimliği, IP ve tarayıcı bilgisinin gün gün değişen bir tuzla özeti:

```ts title="src/lib/server/sayac.ts"
const veri = new TextEncoder().encode(`${tuz}|${bugun()}|${ip}|${ua}`);
const ozet = await crypto.subtle.digest('SHA-256', veri);
```

Ertesi gün aynı kişi yeni bir özet üretir; geriye dönük ilişkilendirme mümkün değil.

<Not>İz tablosu yalnızca iki gün tutulur; sayaçlar kalıcıdır.</Not>

## Tek sorguda "yeniyse say"

`INSERT OR IGNORE` ile iz bırakıp `meta.changes` değerine bakmak yeterli.
