// Zen'in kendi teması: atölye temasından ayrı saklanır. İlk değeri app.html betiği uygular.
export type ZenTema = 'zen-gunduz' | 'zen-gece';

export const zen = $state({ tema: 'zen-gunduz' as ZenTema });

export function zenTemaOku() {
	zen.tema = document.documentElement.dataset.theme === 'zen-gece' ? 'zen-gece' : 'zen-gunduz';
}

export function zenTemaDegistir() {
	zen.tema = zen.tema === 'zen-gunduz' ? 'zen-gece' : 'zen-gunduz';
	document.documentElement.dataset.theme = zen.tema;
	try {
		localStorage.setItem('zen-tema', zen.tema);
	} catch {
		// Gizli pencere vb.: tercih yalnızca bu oturumda geçerli.
	}
}
