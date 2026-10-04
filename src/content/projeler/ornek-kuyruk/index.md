---
baslik: Kuyruk (örnek)
ozet: Örnek proje kaydı — kendi projenle değiştir. Dağıtık iş kuyruğu için hafif bir zamanlayıcı.
rol: Arka uç geliştirici
yigin: [Go, PostgreSQL, Docker]
yil: 2025
durum: yayinda
baglantilar: { kaynak: "https://github.com/isrky" }
one_cikan: true
sira: 2
ornek: true
---

Bu bir **örnek** proje kaydıdır; projeler sayfasının nasıl görüneceğini göstermek için eklendi.

## Problem

Zamanlanmış işlerin tek bir sunucuya bağımlı olması.

## Yaklaşım

PostgreSQL `SKIP LOCKED` ile çok işçili kuyruk.
