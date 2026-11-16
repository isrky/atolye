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

`src/content/yazilar/<NNN>-<kisa-ad>/index.md` oluştur, örneğin `004-yeni-yazi/index.md`.

- Numara (`004`) yazının kalıcı adresini belirler: **`/yazilar/yz-004`**. Tarih değişse ya da eski tarihli bir yazı eklense de numaralar kaymaz.
- Bir sonraki boş numarayı kullan; numaraları yeniden kullanma, yayımlanmış bir yazının numarasını değiştirme. Aynı numara ya da aynı kısa ad iki kez kullanılırsa derleme hata verir.
- Kısa ad (`yeni-yazi`) görünmez ama görüntülenme/damga sayaçlarının anahtarıdır; yayımladıktan sonra değiştirme.

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
| `![alt](./x.jpg "altyazı")`                       | Düz görsel; `<Sekil>` gibi basınca ışık kutusunda büyür        |
| `<Diyagram kod={mermaidKodu} baslik>`             | Mermaid, temaya göre yeniden çizilir                           |
| `<Demo baslik>…</Demo>`                           | Yazı içinde canlı Svelte bileşeni (aynı klasöre `.svelte` koy) |
| `<Sekmeler sekmeler={[{ ad, icerik: snippet }]}>` | Çok dosyalı kod sekmeleri                                      |
| ` ```ts title="dosya.ts" `                        | Shiki vurgulama, dosya adı sekmesi + kopyala                   |
| `$x^2$`, `$$…$$`                                  | KaTeX (derleme anında)                                         |

Ön bilgi derleme anında doğrulanır; eksik/yanlış alan derlemeyi anlaşılır bir hatayla durdurur.

### Paylaşım görselleri

Her yazı için bağlantı önizlemesi (`static/paylas/yazilar/yz-NNN/embed.png`, 1200×630) ve indirilebilir sosyal görsel (`sosyal.png`, 1080×1440, 3:4) `scripts/paylasim.ts` ile üretilir. `bun run build` bunu otomatik çalıştırır; yalnızca değişen yazılar yeniden çizilir (Playwright Chromium gerekir). Üretilen görselleri depoya ekle — `bunx vitest run` eksik ya da eskimiş görseli yakalar. Şablonu değiştirince `SABLON_SURUMU` değerini artır.

## Zen yazısı eklemek

Zen (`/zen`) kişisel yazıların durduğu, atölyeden ayrı görünen bölümdür: kendi teması, kendi RSS'i (`/zen/rss.xml`) vardır; sayaç, damga, etiket ve arama yoktur.

`src/content/zen/<kisa-ad>/index.md` oluştur, örneğin `sabah-yuruyusleri/index.md`.

- Klasör adı yazının kalıcı adresidir: **`/zen/sabah-yuruyusleri`**. Yalnızca küçük harf, rakam ve tire; yayımladıktan sonra değiştirme.
- `bun run paylasim` görselleri `static/paylas/zen/<kisa-ad>/` altına üretir; depoya ekle.

```md
---
baslik: Başlık
tarih: 2026-11-16
ozet: Listede, RSS'te ve paylaşım görselinde görünen bir cümle. # isteğe bağlı
sabit: true # isteğe bağlı; listenin başında, yılların üstünde durur
taslak: true # isteğe bağlı; yalnızca dev'de görünür
---
```

Görseller (`![alt](./x.jpg "altyazı")` ya da `<Sekil>`) Zen'de sade görünür ve basınca ışık kutusunda büyür.

Gövde yerleşimi `src/lib/markdown/ZenDuzen.svelte`, kabuk `src/lib/zen/Kabuk.svelte`, tema `src/routes/layout.css` içindeki `zen-gunduz` / `zen-gece` bloklarıdır.

## Görseller

Fotoğraflar depoda durmaz: özgün dosya Cloudflare R2'de (`gorsel.isrky.com`) durur, küçük boyutları ve AVIF/WebP biçimlerini Cloudflare istek anında üretir. Depoda yalnızca adres ve `src/content/gorseller.json` içindeki boyut kaydı kalır.

```sh
bun run gorsel ~/Resimler/tepeler.jpg zen/sabah-yuruyusleri          # yükler, kaydeder
bun run gorsel ~/Resimler/*.jpg yazilar/yeni-yazi --kuru             # yalnızca ne olacağını gösterir
bun run gorsel --kullanilmayan                                       # hiçbir yazıda geçmeyen kayıtlar
```

Komut her dosyayı döndürür, **üst verisini siler (çekim konumu dahil)**, uzun kenarını 3200px'e indirir, içeriğine göre adlandırır ve yazıya yapıştırılacak satırı basar:

```md
![Alt metin](https://gorsel.isrky.com/zen/sabah-yuruyusleri/tepeler-1a2b3c4d.jpg 'Altyazı')
```

`<Sekil src="https://gorsel.isrky.com/…" alt="…" altyazi="…" />` de aynı adresi kabul eder. `gorseller.json` değişikliğini depoya ekle; `bunx vitest run` yüklenmemiş ya da yanlış yazılmış adresi yakalar. Kovadan silme elle yapılır (`bunx wrangler r2 object delete isrky-gorsel/<anahtar> --remote`).

Kodla birlikte durması gereken küçük görseller (şema, ekran görüntüsü) için yerel dosya kullanmaya devam et: `import img from './x.png?enhanced'` + `<Sekil src={img} … />`.

Bir kerelik kurulum:

1. `isrky.com` Cloudflare hesabında bir alan (zone) olmalı; bu makinede `bunx wrangler login`.
2. `bunx wrangler r2 bucket create isrky-gorsel`
3. Panel → R2 → `isrky-gorsel` → Settings → Custom Domains → `gorsel.isrky.com` ekle.
4. Panel → Images → Transformations → `isrky.com` için etkinleştir.

Ücretsiz sınırlar: R2'de 10 GB depolama; ayda 5.000 benzersiz dönüşüm (görsel başına en çok üç boyut). Sınır aşılırsa ücret kesilmez; yeni boyutlar yerine özgün dosya sunulur.

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
