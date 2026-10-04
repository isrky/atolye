export const site = {
	ad: 'İsmail Sarıkaya',
	kisaAd: 'isrky',
	alanAdi: 'isrky.com',
	url: 'https://isrky.com',
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
