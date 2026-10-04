// Basit, uygulama çapında bildirim (toast) kuyruğu.
type Bildirim = { id: number; metin: string; tur: 'bilgi' | 'hata' };

let sira = 0;
export const bildirimler = $state<Bildirim[]>([]);

export function bildir(metin: string, tur: Bildirim['tur'] = 'bilgi', sure = 3200) {
	const id = ++sira;
	bildirimler.push({ id, metin, tur });
	setTimeout(() => {
		const i = bildirimler.findIndex((b) => b.id === id);
		if (i >= 0) bildirimler.splice(i, 1);
	}, sure);
}
