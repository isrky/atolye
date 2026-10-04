import { DAMGALAR, type DamgaTuru, type SayacYaniti } from '#lib/damgalar.ts';

const bugun = (simdi = new Date()) => simdi.toISOString().slice(0, 10);

/** Ham IP saklamadan, gün gün değişen anonim ziyaretçi kimliği. */
export async function ziyaretciKimligi(ip: string, ua: string, tuz: string, simdi = new Date()) {
	const veri = new TextEncoder().encode(`${tuz}|${bugun(simdi)}|${ip}|${ua}`);
	const ozet = await crypto.subtle.digest('SHA-256', veri);
	return [...new Uint8Array(ozet)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** İz kaydı yeniyse true döner (aynı gün tekrar sayılmaz). */
async function izBirak(
	db: D1Database,
	anahtar: string,
	olay: string,
	ziyaretci: string,
	gun: string
) {
	const r = await db
		.prepare('INSERT OR IGNORE INTO iz (anahtar, olay, ziyaretci, gun) VALUES (?, ?, ?, ?)')
		.bind(anahtar, olay, ziyaretci, gun)
		.run();
	return (r.meta.changes ?? 0) > 0;
}

export async function oku(db: D1Database, anahtar: string, ziyaretci: string, simdi = new Date()) {
	const [g, d, b] = await db.batch<Record<string, unknown>>([
		db.prepare('SELECT sayi FROM goruntulenme WHERE anahtar = ?').bind(anahtar),
		db.prepare('SELECT tur, sayi FROM damga WHERE anahtar = ?').bind(anahtar),
		db
			.prepare(
				"SELECT olay FROM iz WHERE anahtar = ? AND ziyaretci = ? AND gun = ? AND olay LIKE 'damga:%'"
			)
			.bind(anahtar, ziyaretci, bugun(simdi))
	]);
	const damgalar = Object.fromEntries(DAMGALAR.map((x) => [x.tur, 0])) as Record<DamgaTuru, number>;
	for (const satir of d.results) damgalar[satir.tur as DamgaTuru] = Number(satir.sayi);
	return {
		goruntulenme: Number(g.results[0]?.sayi ?? 0),
		damgalar,
		basilan: b.results.map((s) => String(s.olay).slice('damga:'.length) as DamgaTuru)
	} satisfies SayacYaniti;
}

export async function goruntulenmeSay(
	db: D1Database,
	anahtar: string,
	ziyaretci: string,
	simdi = new Date()
) {
	const gun = bugun(simdi);
	if (await izBirak(db, anahtar, 'goruntulenme', ziyaretci, gun)) {
		await db
			.prepare(
				'INSERT INTO goruntulenme (anahtar, sayi) VALUES (?, 1) ON CONFLICT(anahtar) DO UPDATE SET sayi = sayi + 1'
			)
			.bind(anahtar)
			.run();
		// Ara sıra eski izleri temizle; sayaçlar kalır, izler yalnızca 2 gün tutulur.
		if (Math.random() < 0.02) {
			const sinir = bugun(new Date(simdi.getTime() - 2 * 864e5));
			await db.prepare('DELETE FROM iz WHERE gun < ?').bind(sinir).run();
		}
	}
	return oku(db, anahtar, ziyaretci, simdi);
}

export async function damgaBas(
	db: D1Database,
	anahtar: string,
	tur: DamgaTuru,
	ziyaretci: string,
	simdi = new Date()
) {
	if (await izBirak(db, anahtar, `damga:${tur}`, ziyaretci, bugun(simdi))) {
		await db
			.prepare(
				'INSERT INTO damga (anahtar, tur, sayi) VALUES (?, ?, 1) ON CONFLICT(anahtar, tur) DO UPDATE SET sayi = sayi + 1'
			)
			.bind(anahtar, tur)
			.run();
	}
	return oku(db, anahtar, ziyaretci, simdi);
}
