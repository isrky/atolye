// @ts-check
// Plain JS so mdsvex.config.js (loaded by Vite without TS) can share it.

/** @type {Record<string, string>} */
const harfler = {
	ı: 'i',
	İ: 'i',
	ş: 's',
	Ş: 's',
	ğ: 'g',
	Ğ: 'g',
	ü: 'u',
	Ü: 'u',
	ö: 'o',
	Ö: 'o',
	ç: 'c',
	Ç: 'c'
};

/**
 * Türkçe karakterleri sadeleştirip URL dostu kısa ad üretir.
 * @param {string} metin
 */
export function slugify(metin) {
	return metin
		.replace(/[ıİşŞğĞüÜöÖçÇ]/g, (h) => harfler[h])
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}
