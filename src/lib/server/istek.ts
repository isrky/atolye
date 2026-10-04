import { error } from '@sveltejs/kit';
import { dev } from '$app/env';
import { env } from 'cloudflare:workers';
import { gecerliAnahtarlar } from './icerik';
import { ziyaretciKimligi } from './sayac';

/** Ortak API ön kontrolü: geçerli içerik anahtarı, veritabanı ve ziyaretçi kimliği. */
export async function hazirla(
	request: Request,
	params: { tur: string; slug: string },
	getClientAddress: () => string
) {
	const anahtar = `${params.tur}:${params.slug}`;
	if (!gecerliAnahtarlar.has(anahtar)) error(404, 'Böyle bir içerik yok');
	if (!env.DB) error(503, 'Sayaç şu an kullanılamıyor');
	const tuz = env.TUZ || (dev ? 'gelistirme' : '');
	if (!tuz) error(503, 'Sayaç yapılandırılmamış');
	const ip = request.headers.get('cf-connecting-ip') ?? getClientAddress();
	const ziyaretci = await ziyaretciKimligi(ip, request.headers.get('user-agent') ?? '', tuz);
	return { db: env.DB, anahtar, ziyaretci };
}
