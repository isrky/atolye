// Paylaşım görselleri: her yazı için bağlantı önizlemesi (1200×630) ve indirilebilir
// sosyal görsel (1080×1440, 3:4), ayrıca sitenin varsayılan önizlemesi.
// Çalıştır: `bun run paylasim` (derlemeden önce otomatik çalışır).
// Değişmeyen yazılar atlanır; bu yüzden güncel görseller depodaysa tarayıcı gerekmez.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { compile } from 'mdsvex';
import mdsvexAyarlari from '../mdsvex.config.js';
import { yazilariDerle } from '../src/lib/content/derle.ts';
import type { Yazi } from '../src/lib/content/sema.ts';

const KOK = new URL('..', import.meta.url).pathname;
const CIKTI = join(KOK, 'static/paylas');
const MANIFEST = join(CIKTI, 'manifest.json');
const VARSAYILAN = join(KOK, 'static/og/varsayilan.png');
// Şablonu değiştirince artır: tüm görseller yeniden üretilir.
const SABLON_SURUMU = 2;

// ---------- İçerik ----------

async function yazilariOku() {
	const klasor = join(KOK, 'src/content/yazilar');
	// Yerleşim (layout) bileşeni burada gerekmez; yalnızca meta veri alınıyor.
	const ayarlar = { ...mdsvexAyarlari, layout: undefined };
	const moduller: Record<string, Record<string, unknown>> = {};
	for (const slug of readdirSync(klasor)) {
		const dosya = join(klasor, slug, 'index.md');
		if (!existsSync(dosya)) continue;
		// Sitenin kendi mdsvex ayarlarıyla derle: ön bilgi + okuma süresi birebir aynı olur.
		const sonuc = await compile(readFileSync(dosya, 'utf8'), { ...ayarlar, filename: dosya });
		const meta = sonuc?.code.match(/export const metadata = (\{.*\});/)?.[1];
		moduller[`/src/content/yazilar/${slug}/index.md`] = meta ? JSON.parse(meta) : {};
	}
	return yazilariDerle(moduller, false);
}

const tarihYaz = (iso: string) =>
	new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(
		new Date(iso)
	);

const ozetle = (y: Yazi) =>
	createHash('sha256')
		.update(
			JSON.stringify([
				SABLON_SURUMU,
				y.slug,
				y.seriNo,
				y.baslik,
				y.ozet,
				y.tarih,
				y.etiketler,
				y.seri?.ad,
				y.seri?.sira,
				y.okumaSuresi
			])
		)
		.digest('hex')
		.slice(0, 16);

// ---------- Şablonlar ----------

const b64 = (yol: string) => readFileSync(join(KOK, 'node_modules', yol)).toString('base64');
const yazitipleri = () => {
	const yuz = (aile: string, agirlik: string, dosya: string, aralik?: string) =>
		`@font-face{font-family:${aile};font-weight:${agirlik};src:url(data:font/woff2;base64,${b64(dosya)})${aralik ? `;unicode-range:${aralik}` : ''}}`;
	const ext = 'U+0100-024F,U+0259,U+1E00-1EFF,U+20A0-20C0';
	return [
		yuz(
			'B',
			'200 800',
			'@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-opsz-normal.woff2'
		),
		yuz(
			'B',
			'200 800',
			'@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-ext-opsz-normal.woff2',
			ext
		),
		yuz('S', '400', '@fontsource/dm-sans/files/dm-sans-latin-400-normal.woff2'),
		yuz('S', '400', '@fontsource/dm-sans/files/dm-sans-latin-ext-400-normal.woff2', ext),
		yuz('M', '700', '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff2'),
		yuz(
			'M',
			'700',
			'@fontsource/jetbrains-mono/files/jetbrains-mono-latin-ext-700-normal.woff2',
			ext
		)
	].join('\n');
};

// tezgah teması renkleri (src/routes/layout.css ile aynı).
const RENK = {
	kagit: 'oklch(97.5% 0.012 92)',
	murekkep: 'oklch(19% 0.012 265)',
	sari: 'oklch(89% 0.175 100)',
	pembe: 'oklch(78% 0.16 350)',
	mavi: 'oklch(48% 0.2 263)'
};

const kacis = (s: string) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const ortakCss = (genislik: number, yukseklik: number) => `
${yazitipleri()}
*{box-sizing:border-box;margin:0}
body{width:${genislik}px;height:${yukseklik}px;overflow:hidden;position:relative;color:${RENK.murekkep};
	background:${RENK.kagit};font-family:S;
	background-image:linear-gradient(to right,rgb(20 22 30/.07) 1px,transparent 1px),linear-gradient(to bottom,rgb(20 22 30/.07) 1px,transparent 1px);
	background-size:24px 24px}
.sayfa{position:absolute;background:${RENK.kagit};border:4px solid ${RENK.murekkep};box-shadow:12px 12px 0 ${RENK.murekkep};overflow:hidden}
.delikler{position:absolute;inset:0 auto 0 0;border-right:3px solid ${RENK.pembe};
	background:radial-gradient(circle at 50% 50%,${RENK.murekkep} 0 7px,transparent 8px);background-repeat:repeat-y}
.cizgiler{position:absolute;inset:0;background:repeating-linear-gradient(to bottom,transparent 0 47px,rgb(45 79 209/.16) 47px 48px)}
.icerik{position:absolute;display:flex;flex-direction:column}
.no{font:700 24px M;background:${RENK.sari};border:3px solid ${RENK.murekkep};padding:4px 12px;letter-spacing:.02em}
.seri{font:700 20px M;border:3px solid ${RENK.murekkep};padding:5px 12px;background:${RENK.kagit}}
.ust{display:flex;gap:16px;align-items:center;flex-wrap:wrap}
h1{font-family:B;font-weight:800;letter-spacing:-.015em;line-height:1.02;overflow-wrap:anywhere}
.ozet{font-family:S;opacity:.82;display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden}
.alt{font:700 20px M;display:flex;gap:14px;flex-wrap:wrap;align-items:center}
.etiket{border:2px solid ${RENK.murekkep};padding:2px 8px;background:${RENK.kagit}}
.damga{position:absolute;background:${RENK.pembe};color:${RENK.murekkep};border:4px solid ${RENK.murekkep};
	box-shadow:8px 8px 0 ${RENK.murekkep};font-family:B;font-weight:800;letter-spacing:.01em;transform:rotate(-8deg)}
`;

// Başlığı en fazla `satir` satıra sığana kadar küçültür.
const sigdir = (secici: string, satir: number, enKucuk: number) => `
<script>
	const el = document.querySelector('${secici}');
	let boy = parseFloat(getComputedStyle(el).fontSize);
	const satirlar = () => Math.round(el.getBoundingClientRect().height / (boy * 1.02));
	while (satirlar() > ${satir} && boy > ${enKucuk}) { boy -= 2; el.style.fontSize = boy + 'px'; }
</script>`;

function embedHtml(y: Yazi) {
	const etiketler = y.etiketler
		.slice(0, 3)
		.map((e) => `<span class="etiket">#${kacis(e)}</span>`)
		.join('');
	return `<!doctype html><html lang="tr"><head><meta charset="utf-8"><style>${ortakCss(1200, 630)}
.sayfa{left:48px;top:40px;right:72px;bottom:64px}
.delikler{width:76px;background-size:76px 64px;background-position:0 8px}
.icerik{left:120px;right:56px;top:44px;bottom:40px;gap:22px}
h1{font-size:76px}
.ozet{font-size:27px;line-height:1.45;-webkit-line-clamp:2}
.alt{margin-top:auto}
.damga{right:44px;bottom:30px;font-size:34px;padding:8px 18px 10px}
</style></head><body>
<div class="sayfa"><div class="cizgiler"></div><div class="delikler"></div>
<div class="icerik">
	<div class="ust"><span class="no">${y.seriNo}</span>${y.seri ? `<span class="seri">${kacis(y.seri.ad)} · ${y.seri.sira}. bölüm</span>` : ''}</div>
	<h1>${kacis(y.baslik)}</h1>
	<p class="ozet">${kacis(y.ozet)}</p>
	<div class="alt"><span>${tarihYaz(y.tarih)}</span><span>·</span><span>${y.okumaSuresi} dk okuma</span>${etiketler}</div>
</div></div>
<div class="damga">isrky.com</div>
${sigdir('h1', 3, 40)}
</body></html>`;
}

function sosyalHtml(y: Yazi) {
	const etiketler = y.etiketler
		.slice(0, 4)
		.map((e) => `<span class="etiket">#${kacis(e)}</span>`)
		.join('');
	return `<!doctype html><html lang="tr"><head><meta charset="utf-8"><style>${ortakCss(1080, 1440)}
.sayfa{left:80px;top:96px;right:96px;bottom:168px}
.delikler{width:84px;background-size:84px 72px;background-position:0 16px}
.icerik{left:136px;right:64px;top:72px;bottom:64px;gap:36px}
.no{font-size:30px}.seri{font-size:24px}
h1{font-size:112px}
.ozet{font-size:38px;line-height:1.45;-webkit-line-clamp:4}
.alt{font-size:24px;gap:12px}
.etiketler{display:flex;gap:12px;flex-wrap:wrap;font:700 24px M}
.adres{margin-top:auto;font:700 26px M;border-top:3px dashed rgb(20 22 30/.35);padding-top:24px;display:flex;flex-direction:column;gap:10px}
.adres b{font-size:30px}
.damga{right:64px;bottom:88px;font-size:46px;padding:10px 26px 14px}
</style></head><body>
<div class="sayfa"><div class="cizgiler"></div><div class="delikler"></div>
<div class="icerik">
	<div class="ust"><span class="no">${y.seriNo}</span>${y.seri ? `<span class="seri">${kacis(y.seri.ad)} · ${y.seri.sira}. bölüm</span>` : ''}</div>
	<h1>${kacis(y.baslik)}</h1>
	<p class="ozet">${kacis(y.ozet)}</p>
	<div class="etiketler">${etiketler}</div>
	<div class="adres"><span>${tarihYaz(y.tarih)} · ${y.okumaSuresi} dk okuma</span><b>isrky.com/yazilar/${kacis(y.slug)}</b></div>
</div></div>
<div class="damga">isrky.com</div>
${sigdir('h1', 5, 56)}
</body></html>`;
}

function varsayilanHtml() {
	return `<!doctype html><html lang="tr"><head><meta charset="utf-8"><style>${ortakCss(1200, 630)}
.kart{position:absolute;left:72px;top:96px;right:240px;border:4px solid ${RENK.murekkep};background:${RENK.kagit};box-shadow:12px 12px 0 ${RENK.murekkep};padding:48px 56px}
.kart .no{font-size:26px;display:inline-block}
h1{font-size:104px;line-height:.88;margin:28px 0 20px;letter-spacing:-2px}
.kart p{font:700 28px M}
.prj{position:absolute;right:64px;top:180px;width:150px;box-sizing:content-box;border:4px solid ${RENK.murekkep};background:#2d4fd1;color:#fff;font:700 22px/1.3 M;padding:16px;transform:rotate(6deg);box-shadow:8px 8px 0 ${RENK.murekkep}}
.damga{right:84px;bottom:66px;font-size:34px;padding:8px 18px 10px}
</style></head><body>
<div class="kart"><span class="no">isrky/atölye</span><h1>İSMAİL<br>SARIKAYA</h1><p>yazılar · projeler · bağlantılar</p></div>
<div class="prj">PRJ-001<br>● yayında</div>
<div class="damga">isrky.com</div>
</body></html>`;
}

// ---------- Üretim ----------

type Is = { ad: string; html: string; dosya: string; genislik: number; yukseklik: number };

async function uret(isler: Is[]) {
	let chromium;
	try {
		({ chromium } = await import('playwright'));
	} catch {
		throw new Error('Playwright yüklü değil');
	}
	const tarayici = await chromium.launch().catch((e: Error) => {
		throw new Error(
			`Paylaşım görselleri güncel değil ama Chromium başlatılamadı.\n` +
				`Görselleri Playwright'ın çalıştığı bir ortamda (ör. nix geliştirme kabuğu) ` +
				`\`bun run paylasim\` ile üretip depoya ekle.\n(${e.message.split('\n')[0]})`
		);
	});
	try {
		for (const is of isler) {
			const sayfa = await tarayici.newPage({
				viewport: { width: is.genislik, height: is.yukseklik }
			});
			await sayfa.setContent(is.html, { waitUntil: 'load' });
			await sayfa.evaluate(() => document.fonts.ready);
			mkdirSync(join(is.dosya, '..'), { recursive: true });
			await sayfa.screenshot({ path: is.dosya });
			await sayfa.close();
			console.log(`  ✓ ${is.ad}`);
		}
	} finally {
		await tarayici.close();
	}
}

async function main() {
	const zorla = process.argv.includes('--zorla');
	const yazilar = await yazilariOku();
	const eski: Record<string, string> = existsSync(MANIFEST)
		? JSON.parse(readFileSync(MANIFEST, 'utf8'))
		: {};
	const yeni: Record<string, string> = {};
	const isler: Is[] = [];

	const varsayilanOzet = `v${SABLON_SURUMU}`;
	yeni['_varsayilan'] = varsayilanOzet;
	if (zorla || eski['_varsayilan'] !== varsayilanOzet || !existsSync(VARSAYILAN))
		isler.push({
			ad: 'varsayılan önizleme',
			html: varsayilanHtml(),
			dosya: VARSAYILAN,
			genislik: 1200,
			yukseklik: 630
		});

	for (const y of yazilar) {
		const ozet = ozetle(y);
		yeni[y.slug] = ozet;
		const klasor = join(CIKTI, 'yazilar', y.slug);
		const embed = join(klasor, 'embed.png');
		const sosyal = join(klasor, 'sosyal.png');
		if (!zorla && eski[y.slug] === ozet && existsSync(embed) && existsSync(sosyal)) continue;
		isler.push({
			ad: `${y.seriNo} ${y.slug} · önizleme`,
			html: embedHtml(y),
			dosya: embed,
			genislik: 1200,
			yukseklik: 630
		});
		isler.push({
			ad: `${y.seriNo} ${y.slug} · sosyal`,
			html: sosyalHtml(y),
			dosya: sosyal,
			genislik: 1080,
			yukseklik: 1440
		});
	}

	// Silinen yazıların görsellerini temizle.
	const yaziKlasoru = join(CIKTI, 'yazilar');
	if (existsSync(yaziKlasoru))
		for (const slug of readdirSync(yaziKlasoru))
			if (!(slug in yeni)) {
				rmSync(join(yaziKlasoru, slug), { recursive: true });
				console.log(`  − ${slug} (silindi)`);
			}

	if (isler.length) {
		console.log(`Paylaşım görselleri üretiliyor (${isler.length})…`);
		await uret(isler);
	} else console.log('Paylaşım görselleri güncel.');

	mkdirSync(CIKTI, { recursive: true });
	writeFileSync(MANIFEST, JSON.stringify(yeni, null, '\t') + '\n');
}

main().catch((e: Error) => {
	console.error(`✗ ${e.message}`);
	process.exit(1);
});
