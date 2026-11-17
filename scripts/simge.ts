// Site simgesini (favicon) üretir: `bun run simge`
//
// Kaynak: static/favicon.svg. Onu değiştirince bu betiği çalıştır ve
// çıkan dosyaları depoya ekle:
//   static/favicon.ico          32×32 (tarayıcılar /favicon.ico'yu kendiliğinden ister)
//   static/apple-touch-icon.png 180×180, opak kâğıt zemin

import { readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const KAYNAK = 'static/favicon.svg';
// tezgah temasının kâğıt rengi (src/routes/layout.css, --color-base-100).
const KAGIT = '#faf7ee';

const svg = readFileSync(KAYNAK);

/** SVG'yi kenarı `kenar` piksel olan kare PNG'ye çevirir. */
function png(kenar: number) {
	// density: 32 birimlik viewBox'ı doğrudan hedef boyutta çizdirir (bulanık büyütme olmaz).
	return sharp(svg, { density: (72 * kenar) / 32 })
		.resize(kenar, kenar)
		.png()
		.toBuffer();
}

/** Tek bir PNG'yi ICO kabına sarar (ICONDIR + ICONDIRENTRY + PNG verisi). */
function ico(veri: Buffer, kenar: number) {
	const baslik = Buffer.alloc(22);
	baslik.writeUInt16LE(0, 0); // ayrılmış
	baslik.writeUInt16LE(1, 2); // tür: simge
	baslik.writeUInt16LE(1, 4); // görsel sayısı
	baslik.writeUInt8(kenar, 6); // genişlik
	baslik.writeUInt8(kenar, 7); // yükseklik
	baslik.writeUInt8(0, 8); // palet yok
	baslik.writeUInt8(0, 9); // ayrılmış
	baslik.writeUInt16LE(1, 10); // renk düzlemi
	baslik.writeUInt16LE(32, 12); // piksel başına bit
	baslik.writeUInt32LE(veri.length, 14); // veri boyutu
	baslik.writeUInt32LE(22, 18); // verinin başlangıcı
	return Buffer.concat([baslik, veri]);
}

writeFileSync('static/favicon.ico', ico(await png(32), 32));

// iOS saydamlığı siyaha boyar ve köşeleri yuvarlar: opak zemin, ortada simge.
const dokunma = await sharp({
	create: { width: 180, height: 180, channels: 4, background: KAGIT }
})
	.composite([{ input: await png(120), gravity: 'centre' }])
	.png()
	.toBuffer();
writeFileSync('static/apple-touch-icon.png', dokunma);

console.log('simge: static/favicon.ico, static/apple-touch-icon.png');
