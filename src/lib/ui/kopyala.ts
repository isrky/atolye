import { bildir } from './bildirim.svelte';

/** Sayfa bağlantısını panoya kopyalar ve sonucu bildirimle söyler. */
export async function baglantiKopyala(adres: string) {
	try {
		await navigator.clipboard.writeText(adres);
		bildir('Sayfanın bağlantısı panoya kopyalandı.');
	} catch {
		bildir('Bağlantı kopyalanamadı; adres çubuğundan kopyalayabilirsin.', 'hata');
	}
}
