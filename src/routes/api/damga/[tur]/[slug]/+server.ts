import { error, json } from '@sveltejs/kit';
import { damgaTuruMu } from '#lib/damgalar.ts';
import { hazirla } from '#lib/server/istek.ts';
import { damgaBas } from '#lib/server/sayac.ts';
import type { RequestHandler } from './$types';

export const prerender = false;

/** Gövde: { "damga": "aydinlatti" } — aynı damga günde bir kez sayılır. */
export const POST: RequestHandler = async ({ request, params, getClientAddress }) => {
	const govde = (await request.json().catch(() => null)) as { damga?: unknown } | null;
	const damga = govde?.damga;
	if (!damgaTuruMu(damga)) error(400, 'Geçersiz damga');
	const { db, anahtar, ziyaretci } = await hazirla(request, params, getClientAddress);
	return json(await damgaBas(db, anahtar, damga, ziyaretci), {
		headers: { 'cache-control': 'no-store' }
	});
};
