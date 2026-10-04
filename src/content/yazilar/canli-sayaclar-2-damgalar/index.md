---
baslik: "Canlı sayaçlar II: Lastik damgalar"
ozet: Beğeni düğmesi yerine kâğıda basılan damgalar ve iyimser arayüz güncellemesi.
tarih: 2026-09-28
etiketler: [Svelte, D1, Tasarım]
seri: { ad: Canlı sayaçlar, sira: 2 }
ornek: true
---

Beğeni kalbi her yerde aynı. Burada onun yerine dört **damga** var: *Aydınlattı*, *Deneyeceğim*, *Kahvelik*, *Ateş*.

## İyimser güncelleme

Damgaya basınca sayı hemen artar; sunucu reddederse geri alınır ve bir bildirim çıkar.

```svelte title="Damgalar.svelte"
<button aria-pressed={basili} onclick={() => canli.damgala(d.tur)}>
	{d.etiket}
</button>
```

## Basma hissi

Düğme basılınca sert gölgesini kaybeder ve 4px sağa-aşağı iner: kâğıda değen bir damga gibi.
