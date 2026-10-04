import { expect, test } from '@playwright/test';

test('ana gezinti tüm bölümlere ulaşır', async ({ page }) => {
	await page.goto('/');
	const nav = page.getByRole('navigation', { name: 'Ana gezinti' });
	for (const [ad, yol] of [
		['Yazılar', '/yazilar'],
		['Projeler', '/projeler'],
		['Bağlantılar', '/baglantilar'],
		['Hakkımda', '/hakkimda']
	]) {
		await nav.getByRole('link', { name: ad }).click();
		await expect(page).toHaveURL(yol);
		await expect(page.locator('h1')).toBeVisible();
	}
});

test('komut paleti Ctrl+K ile açılır ve yazıya götürür', async ({ page }) => {
	await page.goto('/');
	// Kısayol dinleyicisi hidrasyondan sonra bağlanır.
	await page.waitForLoadState('networkidle');
	await page.keyboard.press('Control+k');
	const palet = page.getByRole('dialog', { name: 'Komut paleti' });
	await expect(palet).toBeVisible();
	await palet.getByRole('combobox').fill('tezgah nasıl');
	await expect(palet.getByRole('option').first()).toContainText('Bu tezgah nasıl kuruldu');
	await page.keyboard.press('Enter');
	await expect(page).toHaveURL('/yazilar/yz-003');
});

test('tema seçimi yeniden yüklemede korunur', async ({ page }) => {
	await page.goto('/');
	const once = await page.locator('html').getAttribute('data-theme');
	await page.getByRole('button', { name: /temasına geç/ }).click();
	const sonra = await page.locator('html').getAttribute('data-theme');
	expect(sonra).not.toBe(once);
	await page.reload();
	await expect(page.locator('html')).toHaveAttribute('data-theme', sonra!);
});

test('plan modu açılıp kapanır', async ({ page }) => {
	await page.goto('/');
	const dugme = page.getByRole('button', { name: 'Plan modu' });
	await dugme.click();
	await expect(page.locator('html')).toHaveAttribute('data-plan', '');
	await expect(dugme).toHaveAttribute('aria-pressed', 'true');
	await dugme.click();
	await expect(page.locator('html')).not.toHaveAttribute('data-plan');
});

test('damga basılır ve yeniden yüklemede kalır', async ({ browser }) => {
	// Her koşu yeni bir ziyaretçi: damgalar günde bir kez sayılır.
	const ctx = await browser.newContext({ userAgent: `e2e-${Date.now()}-${Math.random()}` });
	const page = await ctx.newPage();
	await page.goto('/yazilar/yz-003');
	const damga = page.getByRole('button', { name: /Kahvelik/ });
	await expect(damga).toBeEnabled();
	await expect(damga).toHaveAttribute('aria-pressed', 'false');
	const sayi = async () => Number(await damga.locator('[data-sayi]').innerText());
	const once = await sayi();
	await damga.click();
	await expect(damga).toHaveAttribute('aria-pressed', 'true');
	await expect.poll(sayi).toBe(once + 1);
	await page.reload();
	await expect(page.getByRole('button', { name: /Kahvelik/ })).toHaveAttribute(
		'aria-pressed',
		'true'
	);
	await ctx.close();
});

test('olmayan sayfa 404 döner', async ({ page }) => {
	const yanit = await page.goto('/yok-boyle-bir-parca');
	expect(yanit?.status()).toBe(404);
	await expect(page.getByText(/tezgahta yok/i).first()).toBeVisible();
});

test('yazı kendi önizleme görselini bildirir', async ({ page, request }) => {
	await page.goto('/yazilar/yz-001');
	const gorsel = await page.locator('meta[property="og:image"]').getAttribute('content');
	expect(gorsel).toMatch(/\/paylas\/yazilar\/yz-001\/embed\.png$/);
	await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
	const yanit = await request.get(new URL(gorsel!).pathname);
	expect(yanit.status()).toBe(200);
	expect(yanit.headers()['content-type']).toContain('image/png');
});

test('Paylaş penceresi görsel indirme ve bağlantı seçenekleri sunar', async ({ page, request }) => {
	await page.goto('/yazilar/yz-003');
	await page.waitForLoadState('networkidle');
	await page.getByRole('button', { name: 'Paylaş', exact: true }).click();
	const pencere = page.getByRole('dialog', { name: 'Bu sayfayı paylaş' });
	await expect(pencere).toBeVisible();
	const indir = pencere.getByRole('link', { name: 'Görseli indir' });
	await expect(indir).toHaveAttribute('download', 'isrky-yz-003.png');
	const yanit = await request.get((await indir.getAttribute('href'))!);
	expect(yanit.status()).toBe(200);
	await expect(pencere.getByRole('link', { name: /WhatsApp/ })).toHaveAttribute(
		'href',
		new RegExp(encodeURIComponent('/yazilar/yz-003'))
	);
	await page.keyboard.press('Escape');
	await expect(pencere).toBeHidden();
});

test('yazılar kısa numaralı adreste; eski ve bilinmeyen adresler 404', async ({ page }) => {
	const yanit = await page.goto('/yazilar/yz-002');
	expect(yanit?.status()).toBe(200);
	await expect(page.locator('h1')).toContainText('Lastik damgalar');
	for (const yol of ['/yazilar/bu-tezgah-nasil-kuruldu', '/yazilar/yz-999'])
		expect((await page.goto(yol))?.status()).toBe(404);
});
