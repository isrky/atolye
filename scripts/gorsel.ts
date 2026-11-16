// Yazı görsellerini Cloudflare R2'ye yükler; depoda yalnızca adres ve boyut kaydı kalır.
//
//   bun run gorsel <dosya...> <yer>          ör. bun run gorsel ~/Resimler/tepeler.jpg zen/sabah
//   bun run gorsel <dosya...> <yer> --kuru   yüklemeden ve kaydetmeden ne olacağını gösterir
//   bun run gorsel --kullanilmayan           hiçbir yazıda geçmeyen kayıtları listeler
//
// Her dosya: döndürülür (EXIF yönü), üst verisi silinir (konum dahil), uzun kenarı 3200px'e
// indirilir, içeriğine göre adlandırılır (ad-<8 hane>.jpg), yüklenir ve
// src/content/gorseller.json'a boyutuyla yazılır. Yazıya yapıştırılacak satır ekrana basılır.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, extname, join } from 'node:path';
import sharp from 'sharp';
import { site } from '../src/lib/site.ts';

const KOK = new URL('..', import.meta.url).pathname;
const MANIFEST = join(KOK, 'src/content/gorseller.json');
const ICERIK = join(KOK, 'src/content');
const UZUN_KENAR = 3200;
const YER = /^(zen|yazilar|projeler)\/[a-z0-9]+(?:-[a-z0-9]+)*$/;

type Manifest = Record<string, { w: number; h: number }>;

const manifestOku = (): Manifest => JSON.parse(readFileSync(MANIFEST, 'utf8'));
const manifestYaz = (m: Manifest) =>
	writeFileSync(
		MANIFEST,
		JSON.stringify(Object.fromEntries(Object.entries(m).sort()), null, '\t') + '\n'
	);

function dur(mesaj: string): never {
	console.error(`✗ ${mesaj}`);
	process.exit(1);
}

/** "Sabah Yürüyüşü (2).JPG" → "sabah-yuruyusu-2" */
function adlandir(dosya: string): string {
	const tr: Record<string, string> = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u' };
	const ad = basename(dosya, extname(dosya))
		.toLocaleLowerCase('tr')
		.replace(/[çğıöşü]/g, (h) => tr[h])
		.normalize('NFKD')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
	return ad || 'gorsel';
}

/** Yönü uygular, üst veriyi siler, küçültür. PNG PNG kalır; gerisi JPEG olur. */
async function isle(dosya: string) {
	const png = extname(dosya).toLowerCase() === '.png';
	// sharp üst veriyi (EXIF, GPS, XMP) varsayılan olarak yazmaz; renk profili sRGB'ye çevrilir.
	const boru = sharp(dosya)
		.rotate()
		.resize({ width: UZUN_KENAR, height: UZUN_KENAR, fit: 'inside', withoutEnlargement: true });
	const { data, info } = await (
		png ? boru.png({ compressionLevel: 9 }) : boru.jpeg({ quality: 90, mozjpeg: true })
	).toBuffer({ resolveWithObject: true });

	const ust = await sharp(data).metadata();
	if (ust.exif || ust.xmp || ust.iptc) dur(`${dosya}: üst veri silinemedi, yükleme iptal edildi`);

	const ozet = createHash('sha256').update(data).digest('hex').slice(0, 8);
	return {
		veri: data,
		w: info.width,
		h: info.height,
		uzanti: png ? 'png' : 'jpg',
		tur: png ? 'image/png' : 'image/jpeg',
		ozet
	};
}

function yukle(anahtar: string, yol: string, tur: string) {
	const sonuc = spawnSync(
		join(KOK, 'node_modules/.bin/wrangler'),
		[
			'r2',
			'object',
			'put',
			`${site.gorsel.kova}/${anahtar}`,
			`--file=${yol}`,
			'--remote',
			`--content-type=${tur}`,
			// Ad içeriğe bağlı olduğu için dosya hiç değişmez: süresiz önbelleklenebilir.
			'--cache-control=public, max-age=31536000, immutable'
		],
		{ cwd: KOK, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' }
	);
	if (sonuc.status !== 0)
		dur(
			`${anahtar} yüklenemedi.\n${(sonuc.stderr || sonuc.stdout || String(sonuc.error)).trim()}\n` +
				`Kova (${site.gorsel.kova}) kurulu mu, \`bunx wrangler login\` yapıldı mı? Bkz. README → Görseller.`
		);
}

function mdDosyalari(klasor: string): string[] {
	return readdirSync(klasor, { withFileTypes: true }).flatMap((g) =>
		g.isDirectory()
			? mdDosyalari(join(klasor, g.name))
			: /\.(md|svx)$/.test(g.name)
				? [join(klasor, g.name)]
				: []
	);
}

function kullanilmayanlar() {
	const metin = mdDosyalari(ICERIK)
		.map((d) => readFileSync(d, 'utf8'))
		.join('\n');
	const bos = Object.keys(manifestOku()).filter(
		(a) => !metin.includes(`${site.gorsel.adres}/${a}`)
	);
	if (!bos.length) return console.log('Her kayıt bir yazıda kullanılıyor.');
	console.log(`Hiçbir yazıda geçmeyen ${bos.length} kayıt (kovadan silinmedi):`);
	for (const a of bos) console.log(`  ${a}`);
	console.log(
		`\nSilmek için: bunx wrangler r2 object delete ${site.gorsel.kova}/<anahtar> --remote, sonra kaydı gorseller.json'dan çıkar.`
	);
}

async function ana() {
	const girdi = process.argv.slice(2);
	const bayraklar = new Set(girdi.filter((a) => a.startsWith('--')));
	const konumlu = girdi.filter((a) => !a.startsWith('--'));
	for (const b of bayraklar)
		if (b !== '--kuru' && b !== '--kullanilmayan') dur(`Bilinmeyen seçenek: ${b}`);
	if (bayraklar.has('--kullanilmayan')) return kullanilmayanlar();

	const yer = konumlu.pop();
	if (!yer || !konumlu.length)
		dur(
			'Kullanım: bun run gorsel <dosya...> <yer> [--kuru]   ör. … tepeler.jpg zen/sabah-yuruyusleri'
		);
	if (!YER.test(yer))
		dur(
			`"${yer}" geçerli bir yer değil. Biçim: zen/<kisa-ad>, yazilar/<kisa-ad> ya da projeler/<kisa-ad>`
		);
	for (const d of konumlu) if (!existsSync(d)) dur(`Dosya yok: ${d}`);

	const kuru = bayraklar.has('--kuru');
	const manifest = manifestOku();
	const gecici = mkdtempSync(join(tmpdir(), 'gorsel-'));
	try {
		for (const dosya of konumlu) {
			const g = await isle(dosya);
			const anahtar = `${yer}/${adlandir(dosya)}-${g.ozet}.${g.uzanti}`;
			const boyut = `${g.w}×${g.h}, ${(g.veri.length / 1024).toFixed(0)} KB`;
			if (manifest[anahtar]) {
				console.log(`= ${anahtar} zaten yüklü (${boyut})`);
			} else if (kuru) {
				console.log(`~ ${anahtar} yüklenecekti (${boyut}); --kuru olduğu için atlandı`);
			} else {
				const yol = join(gecici, `yukle.${g.uzanti}`);
				writeFileSync(yol, g.veri);
				yukle(anahtar, yol, g.tur);
				// Her başarılı yüklemeden sonra yaz: sonraki dosya başarısız olsa da kayıt kalır.
				manifest[anahtar] = { w: g.w, h: g.h };
				manifestYaz(manifest);
				console.log(`✓ ${anahtar} yüklendi (${boyut})`);
			}
			console.log(`  ![](${site.gorsel.adres}/${anahtar} "")`);
		}
	} finally {
		rmSync(gecici, { recursive: true, force: true });
	}
	if (!kuru)
		console.log(
			'\nSatırı yazıya yapıştır, alt metni ve altyazıyı doldur; gorseller.json değişikliğini depoya ekle.'
		);
}

await ana();
