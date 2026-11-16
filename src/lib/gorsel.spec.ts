import { describe, expect, it } from 'vitest';
import { gorselAnahtari, uzakGorsel } from './gorsel.ts';

const manifest = {
	'zen/sabah/tepeler-1a2b3c4d.jpg': { w: 3200, h: 2000 },
	'zen/sabah/kucuk-9f8e7d6c.png': { w: 900, h: 600 }
};
const adres = (anahtar: string) => `https://gorsel.isrky.com/${anahtar}`;
const donusum = (anahtar: string, w: number) =>
	`https://gorsel.isrky.com/cdn-cgi/image/width=${w},quality=80,format=auto,onerror=redirect/${anahtar}`;

describe('uzakGorsel', () => {
	it('kovadaki görsel için üç genişlikli srcset ve özgün boyutları verir', () => {
		const a = 'zen/sabah/tepeler-1a2b3c4d.jpg';
		expect(uzakGorsel(adres(a), manifest)).toEqual({
			src: donusum(a, 1280),
			srcset: `${donusum(a, 640)} 640w, ${donusum(a, 1280)} 1280w, ${donusum(a, 2000)} 2000w`,
			sizes: '(min-width: 768px) 720px, 100vw',
			width: 3200,
			height: 2000
		});
	});

	it('özgünden büyük genişlik istemez; özgün genişliği son basamak yapar', () => {
		const a = 'zen/sabah/kucuk-9f8e7d6c.png';
		const g = uzakGorsel(adres(a), manifest)!;
		expect(g.srcset).toBe(`${donusum(a, 640)} 640w, ${donusum(a, 900)} 900w`);
		expect(g.src).toBe(donusum(a, 900));
	});

	it('başka adresleri, yerel yolları ve manifestte olmayanları olduğu gibi bırakır', () => {
		expect(uzakGorsel('/og/zen.png', manifest)).toBeNull();
		expect(uzakGorsel('https://example.com/a.jpg', manifest)).toBeNull();
		expect(uzakGorsel(adres('zen/sabah/yok-00000000.jpg'), manifest)).toBeNull();
		expect(uzakGorsel(undefined, manifest)).toBeNull();
	});

	it('zaten dönüştürülmüş bir adresi anahtar saymaz', () => {
		expect(gorselAnahtari(donusum('zen/sabah/tepeler-1a2b3c4d.jpg', 640))).toBeNull();
		expect(gorselAnahtari(adres('zen/sabah/tepeler-1a2b3c4d.jpg'))).toBe(
			'zen/sabah/tepeler-1a2b3c4d.jpg'
		);
	});
});
