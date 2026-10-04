import { describe, expect, it } from 'vitest';
import { ara, sadelestir, type AramaOgesi } from './arama';

const ogeler: AramaOgesi[] = [
	{
		tur: 'yazi',
		baslik: 'Canlı sayaçlar',
		aciklama: 'D1 ile çerezsiz',
		href: '/a',
		ekler: 'Cloudflare'
	},
	{ tur: 'proje', baslik: 'Kuyruk', aciklama: 'İş kuyruğu', href: '/b', ekler: 'Go PostgreSQL' },
	{ tur: 'sayfa', baslik: 'Hakkımda', aciklama: 'Sayfa', href: '/c' }
];

describe('arama', () => {
	it('Türkçe büyük/küçük harf ve aksandan bağımsızdır', () => {
		expect(sadelestir('İŞ IŞIK Çağrı')).toBe('is isik cagri');
		expect(ara(ogeler, 'canli').map((o) => o.href)).toEqual(['/a']);
		expect(ara(ogeler, 'HAKKIMDA').map((o) => o.href)).toEqual(['/c']);
	});

	it('her sözcüğün eşleşmesini ister ve ekleri de tarar', () => {
		expect(ara(ogeler, 'kuyruk postgres').map((o) => o.href)).toEqual(['/b']);
		expect(ara(ogeler, 'kuyruk rust')).toEqual([]);
	});

	it('boş sorguda hepsini döner', () => {
		expect(ara(ogeler, '  ')).toHaveLength(3);
	});
});
