# isrky.com — Atölye

İsmail Sarıkaya'nın kişisel sitesi: blog, yazılım mühendisliği portfolyosu ve bağlantılar.
SvelteKit 3 + Svelte 5, mdsvex, Tailwind 4 + daisyUI 5, Cloudflare Workers + D1.

## Geliştirme

```sh
bun install
bunx wrangler d1 migrations apply isrky --local   # yerel sayaç veritabanı
bun run dev
```

`.dev.vars` içinde `TUZ="..."` tanımlı olmalı (ziyaretçi özetleri için gizli tuz).

## Yeni yazı

`src/content/yazilar/<kisa-ad>/index.md` oluştur:

```md
---
baslik: Başlık
ozet: Liste ve RSS'te görünen bir iki cümle.
tarih: 2026-10-04
guncelleme: 2026-10-10 # isteğe bağlı
etiketler: [Svelte, Tasarım]
seri: { ad: Seri adı, sira: 1 } # isteğe bağlı
taslak: true # isteğe bağlı; yalnızca dev'de görünür
---

<script>
	import { Not, Dipnot, Sekil, Demo, Diyagram, Sekmeler } from '#lib/markdown/index.ts';
</script>
```

Yazı içi bileşenler (`src/lib/markdown/`):

| Bileşen                                           | Kullanım                                                       |
| ------------------------------------------------- | -------------------------------------------------------------- |
| `<Not tur="not\|ipucu\|uyari" baslik?>`           | Bantlı not kâğıdı                                              |
| `<Dipnot no={1}>…</Dipnot>`                       | Kenar notu (geniş ekranda sağ boşlukta)                        |
| `<Sekil src={img} alt altyazi genis?>`            | `import img from './x.jpg?enhanced'` ile optimize görsel       |
| `<Diyagram kod={mermaidKodu} baslik>`             | Mermaid, temaya göre yeniden çizilir                           |
| `<Demo baslik>…</Demo>`                           | Yazı içinde canlı Svelte bileşeni (aynı klasöre `.svelte` koy) |
| `<Sekmeler sekmeler={[{ ad, icerik: snippet }]}>` | Çok dosyalı kod sekmeleri                                      |
| ` ```ts title="dosya.ts" `                        | Shiki vurgulama, dosya adı sekmesi + kopyala                   |
| `$x^2$`, `$$…$$`                                  | KaTeX (derleme anında)                                         |

Ön bilgi derleme anında doğrulanır; eksik/yanlış alan derlemeyi anlaşılır bir hatayla durdurur.

## Yeni proje

`src/content/projeler/<kisa-ad>/index.md` — alanlar: `baslik, ozet, rol, yigin[], yil, durum (yayinda|devam|arsiv), baglantilar{kaynak?, canli?}, one_cikan?, sira`.

## Bağlantılar ve kişisel bilgiler

- `src/lib/site.ts` — ad, alan adı, sosyal hesaplar
- `src/lib/data/baglantilar.ts` — Bağlantılar sayfası
- `src/lib/data/hakkimda.ts` — Hakkımda / özgeçmiş

`ornek: true` işaretli içerikler örnektir; kendi içeriğinle değiştir.

## Canlı özellikler

- **Damgalar ve görüntülenme** — `/api/sayac/<yazi|proje>/<slug>` ve `/api/damga/...`, Cloudflare D1. Ham IP saklanmaz: ziyaretçi = SHA-256(günlük tuz + IP + UA), izler 2 gün tutulur.
- **Komut paleti** — `⌘K` / `Ctrl+K` / `/`
- **Plan modu** — cetvel düğmesi ya da ↑↑↓↓←→←→BA

## Yayına alma

```sh
bunx wrangler d1 create isrky            # çıkan database_id'yi wrangler.jsonc'ye yaz
bunx wrangler d1 migrations apply isrky --remote
bunx wrangler secret put TUZ
bun run build && bunx wrangler deploy
```

Alan adı: Cloudflare panelinden Worker'a `isrky.com` özel alan adını bağla.

## Kontroller

```sh
bun run check      # svelte-check + wrangler types
bun run lint
bun run test       # vitest + playwright
```
