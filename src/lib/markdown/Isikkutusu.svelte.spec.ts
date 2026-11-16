import { afterEach, describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import Gorsel from './Gorsel.svelte';
import Isikkutusu from './Isikkutusu.svelte';
import { isikkutusuKapat } from './isikkutusu.svelte.ts';

// 1×1 saydam PNG: içerik gerektirmeden gerçek bir görsel.
const nokta =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

afterEach(isikkutusuKapat);

describe('Isikkutusu', () => {
	it('görsele basınca büyük hâlini ve altyazısını gösterir', async () => {
		render(Isikkutusu);
		render(Gorsel, { src: nokta, alt: 'Sabah denizi', title: 'Kıyıda bir sabah' });

		const tetik = page.getByRole('button', { name: 'Görseli büyüt: Sabah denizi' });
		await expect.element(tetik).toBeVisible();
		const pencere = page.getByRole('dialog', { name: 'Büyütülmüş görsel: Sabah denizi' });
		await expect.element(pencere).not.toBeInTheDocument();

		await tetik.click();
		await expect.element(pencere).toBeVisible();
		await expect.element(pencere.getByRole('img', { name: 'Sabah denizi' })).toBeVisible();
		await expect.element(pencere.getByText('Kıyıda bir sabah')).toBeVisible();
	});

	it('Esc ile kapanır ve odak görsele döner; görsele basmak da kapatır', async () => {
		render(Isikkutusu);
		render(Gorsel, { src: nokta, alt: 'Sabah denizi' });
		const tetik = page.getByRole('button', { name: 'Görseli büyüt: Sabah denizi' });
		const pencere = page.getByRole('dialog', { name: /Büyütülmüş görsel/ });

		await tetik.click();
		await expect.element(pencere).toBeVisible();
		await userEvent.keyboard('{Escape}');
		await expect.element(pencere).not.toBeInTheDocument();
		await expect.element(tetik).toHaveFocus();

		await tetik.click();
		await expect.element(pencere).toBeVisible();
		await pencere.getByRole('button', { name: 'Görseli küçült' }).click();
		await expect.element(pencere).not.toBeInTheDocument();
	});

	it('büyük hâl özgün srcset ile gelir; görsel kendi genişliğinden öteye büyütülmez', async () => {
		render(Isikkutusu);
		render(Gorsel, { src: nokta, srcset: '/a-800.png 800w, /a-1600.png 1600w', alt: 'Harita' });

		await page.getByRole('button', { name: 'Görseli büyüt: Harita' }).click();
		const buyuk = page.getByRole('dialog').getByRole('img', { name: 'Harita' });
		await expect.element(buyuk).toHaveAttribute('srcset', '/a-800.png 800w, /a-1600.png 1600w');
		await expect.element(buyuk).toHaveAttribute('sizes', 'min(100vw, 1600px)');
	});

	it('yoğunluk tanımlı srcset (1x, 2x) en büyük dosyaya indirgenir', async () => {
		render(Isikkutusu);
		render(Gorsel, { src: nokta, srcset: `${nokta} 1x, /a-2x.png 2x`, alt: 'Fotoğraf' });

		await page.getByRole('button', { name: 'Görseli büyüt: Fotoğraf' }).click();
		const buyuk = page.getByRole('dialog').getByRole('img', { name: 'Fotoğraf' });
		await expect.element(buyuk).toHaveAttribute('src', '/a-2x.png');
		await expect.element(buyuk).not.toHaveAttribute('srcset');
	});
});
