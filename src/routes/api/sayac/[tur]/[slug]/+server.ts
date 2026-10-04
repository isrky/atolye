import { json } from '@sveltejs/kit';
import { hazirla } from '#lib/server/istek.ts';
import { goruntulenmeSay, oku } from '#lib/server/sayac.ts';
import type { RequestHandler } from './$types';

export const prerender = false;

const onbellekYok = { 'cache-control': 'no-store' };

export const GET: RequestHandler = async ({ request, params, getClientAddress }) => {
	const { db, anahtar, ziyaretci } = await hazirla(request, params, getClientAddress);
	return json(await oku(db, anahtar, ziyaretci), { headers: onbellekYok });
};

/** Görüntülenmeyi bir artırır (aynı ziyaretçi için günde bir kez). */
export const POST: RequestHandler = async ({ request, params, getClientAddress }) => {
	const { db, anahtar, ziyaretci } = await hazirla(request, params, getClientAddress);
	return json(await goruntulenmeSay(db, anahtar, ziyaretci), { headers: onbellekYok });
};
