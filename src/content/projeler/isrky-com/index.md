---
baslik: isrky.com
ozet: Bu site. Markdown'dan beslenen, canlı damgalı, plan modlu kişisel atölye.
rol: Tasarım ve geliştirme
yigin: [SvelteKit, Svelte 5, mdsvex, daisyUI, Cloudflare Workers, D1]
yil: 2026
durum: devam
baglantilar: { kaynak: "https://github.com/isrky/mypage", canli: "https://isrky.com" }
one_cikan: true
sira: 1
---

## Problem

Kişisel siteler ya boş bir şablon ya da yönetmesi yorucu bir CMS. İstenen: depoda yaşayan, git ile yönetilen ama canlı hissettiren bir yer.

## Yaklaşım

- Her yazı ve proje bir markdown dosyası; ön bilgi derleme anında doğrulanıyor.
- Sayfalar derleme anında üretiliyor, Worker yalnızca sayaç API'sini çalıştırıyor.
- Tasarım dili: Neubrutalist bir mühendis tezgahı.

## Sonuç

Yeni bir yazı = yeni bir klasör + `git push`.
