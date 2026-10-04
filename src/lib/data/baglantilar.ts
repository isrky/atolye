// Priz paneli: /baglantilar sayfasındaki bağlantılar.
// TODO: örnek değerleri gerçek hesaplarınla değiştir.
export type Baglanti = {
	ad: string;
	kullanici: string;
	href: string;
	aciklama: string;
	grup: 'kod' | 'sosyal' | 'iletisim' | 'okuma';
	ikon: 'git-branch' | 'briefcase-business' | 'mail' | 'rss' | 'at-sign' | 'book-open' | 'code-xml';
	one?: boolean;
};

export const GRUPLAR = {
	kod: 'Kod',
	sosyal: 'Sosyal',
	iletisim: 'İletişim',
	okuma: 'Okuma'
} as const;

export const baglantilar: Baglanti[] = [
	{
		ad: 'GitHub',
		kullanici: '@isrky',
		href: 'https://github.com/isrky',
		aciklama: 'Açık kaynak işler, deneyler ve bu sitenin kaynağı.',
		grup: 'kod',
		ikon: 'git-branch',
		one: true
	},
	{
		ad: 'LinkedIn',
		kullanici: 'in/isrky',
		href: 'https://www.linkedin.com/in/isrky',
		aciklama: 'İş deneyimi ve özgeçmiş.',
		grup: 'sosyal',
		ikon: 'briefcase-business'
	},
	{
		ad: 'E-posta',
		kullanici: 'merhaba@isrky.com',
		href: 'mailto:merhaba@isrky.com',
		aciklama: 'İş birliği, soru ya da sadece merhaba.',
		grup: 'iletisim',
		ikon: 'mail',
		one: true
	},
	{
		ad: 'RSS',
		kullanici: '/rss.xml',
		href: '/rss.xml',
		aciklama: 'Yeni yazılar okuyucuna düşsün.',
		grup: 'okuma',
		ikon: 'rss'
	}
];
