import { describe, expect, it } from 'vitest';
import { slugify } from './slug.js';

describe('slugify', () => {
	it('Türkçe karakterleri sadeleştirir', () => {
		expect(slugify('Işık, Şeker ve Göğüs Çiçeği')).toBe('isik-seker-ve-gogus-cicegi');
		expect(slugify('İSTANBUL ÜSKÜDAR')).toBe('istanbul-uskudar');
	});

	it('baştaki/sondaki ayraçları ve tekrarları temizler', () => {
		expect(slugify('  --Merhaba,  Dünya!!  ')).toBe('merhaba-dunya');
	});

	it('boş girdi için boş döner', () => {
		expect(slugify('???')).toBe('');
	});
});
