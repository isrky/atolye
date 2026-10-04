// İstemci ve sunucunun paylaştığı damga tanımları.
export const DAMGALAR = [
	{ tur: 'aydinlatti', etiket: 'Aydınlattı' },
	{ tur: 'deneyecegim', etiket: 'Deneyeceğim' },
	{ tur: 'kahvelik', etiket: 'Kahvelik' },
	{ tur: 'ates', etiket: 'Ateş' }
] as const;

export type DamgaTuru = (typeof DAMGALAR)[number]['tur'];
export const damgaTuruMu = (s: unknown): s is DamgaTuru => DAMGALAR.some((d) => d.tur === s);

export type IcerikTuru = 'yazi' | 'proje';

export type SayacYaniti = {
	goruntulenme: number;
	damgalar: Record<DamgaTuru, number>;
	/** Bu ziyaretçinin bugün bastığı damgalar. */
	basilan: DamgaTuru[];
};
