import type { Handle } from '@sveltejs/kit/hooks';

// /zen sayfaları betik çalışmasa da kendi temasıyla gelsin diye <html>'e varsayılan tema yazılır.
// Betik çalışınca (app.html) kayıtlı tercih ya da sistem ayarı bunun üzerine yazar.
export const handle: Handle = ({ event, resolve }) => {
	if (!/^\/zen(\/|$)/.test(event.url.pathname)) return resolve(event);
	return resolve(event, {
		transformPageChunk: ({ html }) =>
			html.replace('<html lang="tr"', '<html lang="tr" data-theme="zen-gunduz"')
	});
};
