import type { Yazi } from '#lib/content/sema.ts';

export type Etiket = { ad: string; slug: string; sayi: number };
export type Seri = { ad: string; slug: string; yazilar: Yazi[] };
