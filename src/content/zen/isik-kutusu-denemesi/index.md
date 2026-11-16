---
baslik: Işık kutusu denemesi
ozet: Görsellerin yazının içinde nasıl durduğunu ve basınca nasıl büyüdüğünü görmek için bir taslak.
tarih: 2026-11-16
taslak: true
ornek: true
---

<script>
	import { Sekil } from '#lib/markdown/index.ts';
	import tepeler from './tepeler.jpg';
	import agac from './agac.jpg?enhanced';
</script>

Bu yazı bir taslak; yalnızca geliştirme sunucusunda görünüyor. Görsellerin sütunda nasıl durduğuna bakmak ve birine basıp büyütmek için burada.

Bazı sabahlar tepeler birbirinin arkasına dizilir, her biri bir öncekinden biraz daha soluk. Fotoğrafını çekince hep daha küçük çıkıyor.

![Sisin içinde art arda dizilmiş, uzaklaştıkça solan tepeler ve alçak bir güneş]({tepeler} "Sabah, tepeler. Düz markdown görseli: üstüne basınca büyür.")

Sütun dar; görsel de onunla birlikte dar. Ayrıntıyı görmek isteyen üstüne basıyor, işi bitince Esc'ye ya da görselin kendisine basıp yazıya dönüyor.

Dik görseller ekranın yüksekliğine göre sığar, yanlarda boşluk kalır:

<Sekil src={agac} alt="Sisli bir yamaçta tek başına duran yapraksız bir ağaç" altyazi="Tek ağaç. Sekil bileşeni: görsel derlemede küçültülür, ışık kutusu tam boyutu açar." />

Altyazısı olmayan bir görsel de olur; o zaman kutuda yalnızca görsel durur.

![Aynı tepeler, altyazısız]({tepeler})

Son görsel depoda değil, Cloudflare'de duruyor (`bun run gorsel` ile yüklendi). Sayfa küçük bir boyutunu ister, ışık kutusu büyüğünü:

![Kovadan gelen tepeler görseli](https://gorsel.isrky.com/zen/isik-kutusu-denemesi/tepeler-cf21b2c3.jpg "Aynı tepeler, bu kez gorsel.isrky.com'dan.")

Denemen bitince bu klasörü sil: `src/content/zen/isik-kutusu-denemesi`.
