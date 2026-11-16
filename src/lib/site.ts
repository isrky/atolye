export const site = {
	ad: 'İsmail Sarıkaya',
	kisaAd: 'isrky',
	alanAdi: 'isrky.com',
	url: 'https://isrky.com',
	// Yazı görselleri: R2 kovası + Cloudflare görsel dönüşümleri (bkz. scripts/gorsel.ts).
	gorsel: {
		adres: 'https://gorsel.isrky.com',
		kova: 'isrky-gorsel',
		/** Sayfada sunulan genişlikler; her biri ayda bir "benzersiz dönüşüm" sayılır. */
		genislikler: [640, 1280, 2000]
	},
	unvan: 'Yazılım Mühendisi',
	aciklama: 'İsmail Sarıkaya’nın atölyesi: yazılım üzerine yazılar, projeler ve bağlantılar.',
	// TODO: gerçek değerlerle güncelle
	konum: 'İstanbul',
	eposta: 'merhaba@isrky.com',
	depo: 'https://github.com/isrky/mypage',
	sosyal: {
		github: 'https://github.com/isrky',
		linkedin: 'https://www.linkedin.com/in/isrky'
	}
} as const;

export const gezinti = [
	{ href: '/', etiket: 'Ana sayfa' },
	{ href: '/yazilar', etiket: 'Yazılar' },
	{ href: '/projeler', etiket: 'Projeler' },
	{ href: '/baglantilar', etiket: 'Bağlantılar' },
	{ href: '/hakkimda', etiket: 'Hakkımda' }
] as const;

export const tarihBicimi = new Intl.DateTimeFormat('tr-TR', {
	day: 'numeric',
	month: 'long',
	year: 'numeric'
});

export function tarihYaz(iso: string) {
	return tarihBicimi.format(new Date(iso));
}
