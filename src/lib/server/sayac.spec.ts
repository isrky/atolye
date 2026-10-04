import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { beforeEach, describe, expect, it } from 'vitest';
import { damgaBas, goruntulenmeSay, oku, ziyaretciKimligi } from './sayac';

/** node:sqlite üzerinde, kullandığımız kadarıyla D1 arayüzü. */
function sahteD1(): D1Database {
	const db = new DatabaseSync(':memory:');
	db.exec(readFileSync('migrations/0001_ilk.sql', 'utf8'));
	const hazirla = (sql: string, degerler: unknown[] = []) => ({
		bind: (...d: unknown[]) => hazirla(sql, d),
		run: async () => {
			const r = db.prepare(sql).run(...(degerler as never[]));
			return { meta: { changes: Number(r.changes) } };
		},
		all: async () => ({ results: db.prepare(sql).all(...(degerler as never[])) })
	});
	return {
		prepare: (sql: string) => hazirla(sql),
		batch: async (s: { all: () => Promise<unknown> }[]) => Promise.all(s.map((x) => x.all()))
	} as unknown as D1Database;
}

describe('sayaç', () => {
	let db: D1Database;
	const gun1 = new Date('2026-10-04T10:00:00Z');
	const gun2 = new Date('2026-10-05T10:00:00Z');

	beforeEach(() => {
		db = sahteD1();
	});

	it('ziyaretçi kimliği günden güne değişir, ham IP içermez', async () => {
		const a = await ziyaretciKimligi('1.2.3.4', 'ua', 'tuz', gun1);
		expect(a).toMatch(/^[0-9a-f]{64}$/);
		expect(a).not.toContain('1.2.3.4');
		expect(await ziyaretciKimligi('1.2.3.4', 'ua', 'tuz', gun1)).toBe(a);
		expect(await ziyaretciKimligi('1.2.3.4', 'ua', 'tuz', gun2)).not.toBe(a);
	});

	it('aynı ziyaretçinin görüntülenmesini günde bir kez sayar', async () => {
		await goruntulenmeSay(db, 'yazi:x', 'v1', gun1);
		await goruntulenmeSay(db, 'yazi:x', 'v1', gun1);
		await goruntulenmeSay(db, 'yazi:x', 'v2', gun1);
		const r = await goruntulenmeSay(db, 'yazi:x', 'v1', gun2);
		expect(r.goruntulenme).toBe(3);
	});

	it('damgayı günde bir kez sayar ve basılanları bildirir', async () => {
		await damgaBas(db, 'yazi:x', 'kahvelik', 'v1', gun1);
		const r = await damgaBas(db, 'yazi:x', 'kahvelik', 'v1', gun1);
		expect(r.damgalar).toEqual({ aydinlatti: 0, deneyecegim: 0, kahvelik: 1, ates: 0 });
		expect(r.basilan).toEqual(['kahvelik']);
		expect((await oku(db, 'yazi:x', 'v2', gun1)).basilan).toEqual([]);
	});
});
