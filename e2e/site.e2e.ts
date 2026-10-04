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
	await expect(page).toHaveURL('/yazilar/bu-tezgah-nasil-kuruldu');
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
	await page.goto('/yazilar/bu-tezgah-nasil-kuruldu');
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
