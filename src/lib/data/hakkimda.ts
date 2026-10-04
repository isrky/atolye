// ÖRNEK VERİ — gerçek bilgilerle değiştir
// /hakkimda sayfası (özgeçmiş) bu dosyadan beslenir. Gerçek içerik girildiğinde `ornek: false` yap;
// sayfadaki "Örnek içerik" uyarısı kendiliğinden kalkar.

export type Deneyim = {
	rol: string;
	sirket: string;
	yer: string;
	baslangic: string;
	/** Boş bırakılırsa "Bugün" yazılır. */
	bitis?: string;
	ciktilar: string[];
};

export type BeceriGrubu = { grup: 'Diller' | 'Altyapı' | 'Araçlar'; ogeler: string[] };

export type Egitim = { okul: string; bolum: string; donem: string };

export const hakkimda = {
	ornek: true,
	ozet: 'Arka uç sistemleri, geliştirici araçları ve onları anlatan yazılar üzerine çalışan bir yazılım mühendisi.',
	durum: 'Yeni iş birliklerine açık',
	calismaDilleri: 'Türkçe, İngilizce',
	bio: [
		'Gündüzleri dağıtık sistemlerin sessiz kalması için uğraşıyorum: kuyruklar, sayaçlar, gözlemlenebilirlik. Akşamları aynı problemleri bu tezgahta küçük parçalara ayırıp yazıya döküyorum.',
		'İyi yazılımın, iyi bir alet gibi elde tutulduğunda anlaşıldığına inanıyorum. Bu yüzden belgelemeyi, ölçmeyi ve sadeleştirmeyi işin kendisi sayıyorum.'
	],
	deneyim: [
		{
			rol: 'Kıdemli Yazılım Mühendisi',
			sirket: 'Örnek Şirket A',
			yer: 'İstanbul · hibrit',
			baslangic: '2023',
			ciktilar: [
				'Sipariş kuyruğunu yeniden tasarladı; p95 işlem süresi 1,8 sn’den 420 ms’ye indi.',
				'Ekip için ortak gözlemlenebilirlik paketini kurdu; olay çözüm süresi yarıya düştü.'
			]
		},
		{
			rol: 'Yazılım Mühendisi',
			sirket: 'Örnek Şirket B',
			yer: 'Uzaktan',
			baslangic: '2020',
			bitis: '2023',
			ciktilar: [
				'Ödeme servisini monolitten ayırdı; dağıtım sıklığı haftalıktan günlüğe çıktı.',
				'İç CLI aracını yazdı; yeni geliştiricinin ilk PR süresi 5 günden 2 güne indi.'
			]
		},
		{
			rol: 'Stajyer → Yazılım Geliştirici',
			sirket: 'Örnek Şirket C',
			yer: 'Ankara',
			baslangic: '2018',
			bitis: '2020',
			ciktilar: [
				'Raporlama panelinin veri katmanını yazdı; gece işleri 3 saatten 40 dakikaya indi.'
			]
		}
	] satisfies Deneyim[],
	beceriler: [
		{ grup: 'Diller', ogeler: ['TypeScript', 'Go', 'Python', 'SQL'] },
		{ grup: 'Altyapı', ogeler: ['PostgreSQL', 'Cloudflare Workers', 'Kafka', 'Docker', 'Nix'] },
		{ grup: 'Araçlar', ogeler: ['SvelteKit', 'OpenTelemetry', 'Grafana', 'Playwright', 'Git'] }
	] satisfies BeceriGrubu[],
	egitim: [
		{ okul: 'Örnek Üniversitesi', bolum: 'Bilgisayar Mühendisliği, Lisans', donem: '2014 – 2018' }
	] satisfies Egitim[],
	// TODO: static/cv.pdf eklenince `hazir: true` yap.
	cv: { href: '/cv.pdf', hazir: false }
};
