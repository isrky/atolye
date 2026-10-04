import { DAMGALAR, type DamgaTuru, type IcerikTuru, type SayacYaniti } from '#lib/damgalar.ts';
import { bildir } from './bildirim.svelte';

/**
 * Bir yazı/proje için canlı sayaç durumu. Sayfa bir tane oluşturur,
 * <Sayac> ve <Damgalar> aynı örneği paylaşır.
 */
export class CanliIcerik {
	veri = $state<SayacYaniti | null>(null);
	durum = $state<'yukleniyor' | 'hazir' | 'hata'>('yukleniyor');

	constructor(
		private tur: IcerikTuru,
		private slug: string
	) {}

	/** Görüntülenmeyi kaydeder ve güncel sayıları getirir. */
	async baslat(fetcher: typeof fetch = fetch) {
		try {
			const r = await fetcher(`/api/sayac/${this.tur}/${this.slug}`, { method: 'POST' });
			if (!r.ok) throw new Error(String(r.status));
			this.veri = await r.json();
			this.durum = 'hazir';
		} catch {
			this.durum = 'hata';
		}
	}

	basildi(d: DamgaTuru) {
		return this.veri?.basilan.includes(d) ?? false;
	}

	/** İyimser güncelleme: önce say, sunucu reddederse geri al. */
	async damgala(d: DamgaTuru, fetcher: typeof fetch = fetch) {
		const v = this.veri;
		if (!v || this.basildi(d)) return;
		const onceki = $state.snapshot(v);
		v.damgalar[d]++;
		v.basilan.push(d);
		try {
			const r = await fetcher(`/api/damga/${this.tur}/${this.slug}`, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ damga: d })
			});
			if (!r.ok) throw new Error(String(r.status));
			this.veri = await r.json();
		} catch {
			this.veri = onceki;
			const etiket = DAMGALAR.find((x) => x.tur === d)?.etiket;
			bildir(`“${etiket}” damgası basılamadı. Bağlantını kontrol edip tekrar dene.`, 'hata');
		}
	}
}
