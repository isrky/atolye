import { afterEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import Damgalar from './Damgalar.svelte';
import { CanliIcerik } from './canli.svelte';
import type { SayacYaniti } from '#lib/damgalar.ts';

const veri = (kahvelik: number, basilan: SayacYaniti['basilan'] = []): SayacYaniti => ({
	goruntulenme: 7,
	damgalar: { aydinlatti: 0, deneyecegim: 0, kahvelik, ates: 0 },
	basilan
});

const yanit = (govde: unknown, status = 200) =>
	new Response(JSON.stringify(govde), { status, headers: { 'content-type': 'application/json' } });

afterEach(() => vi.unstubAllGlobals());

describe('Damgalar', () => {
	it('basınca sayıyı artırır ve düğmeyi basılı gösterir', async () => {
		const fetchSahte = vi
			.fn()
			.mockResolvedValueOnce(yanit(veri(2)))
			.mockResolvedValueOnce(yanit(veri(3, ['kahvelik'])));
		vi.stubGlobal('fetch', fetchSahte);
		const canli = new CanliIcerik('yazi', 'deneme');
		await canli.baslat();
		render(Damgalar, { canli });

		const dugme = page.getByRole('button', { name: /Kahvelik/ });
		await expect.element(dugme).toHaveAttribute('aria-pressed', 'false');
		await dugme.click();
		await expect.element(dugme).toHaveAttribute('aria-pressed', 'true');
		await expect.element(dugme).toHaveTextContent('3');
		expect(fetchSahte).toHaveBeenLastCalledWith(
			'/api/damga/yazi/deneme',
			expect.objectContaining({ method: 'POST' })
		);
	});

	it('sunucu reddederse geri alır', async () => {
		vi.stubGlobal(
			'fetch',
			vi
				.fn()
				.mockResolvedValueOnce(yanit(veri(5)))
				.mockResolvedValueOnce(yanit({ message: 'x' }, 503))
		);
		const canli = new CanliIcerik('yazi', 'deneme');
		await canli.baslat();
		render(Damgalar, { canli });

		const dugme = page.getByRole('button', { name: /Kahvelik/ });
		await dugme.click();
		await expect.element(dugme).toHaveAttribute('aria-pressed', 'false');
		await expect.element(dugme).toHaveTextContent('5');
	});

	it('API yoksa açıklama gösterir', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('ağ yok')));
		const canli = new CanliIcerik('yazi', 'deneme');
		await canli.baslat();
		render(Damgalar, { canli });
		await expect.element(page.getByRole('status')).toHaveTextContent(/ulaşılamıyor/);
	});
});
