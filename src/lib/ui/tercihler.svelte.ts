// Tema ve plan modu: <html> öznitelikleri + localStorage. İlk değeri app.html betiği uygular.
import { bildir } from './bildirim.svelte';

export type Tema = 'tezgah' | 'gece-vardiyasi';

export const tercihler = $state({ tema: 'tezgah' as Tema, plan: false });

function sakla(anahtar: string, deger: string | null) {
	try {
		if (deger === null) localStorage.removeItem(anahtar);
		else localStorage.setItem(anahtar, deger);
	} catch {
		// Gizli pencere vb.: tercih yalnızca bu oturumda geçerli.
	}
}

export function tercihleriOku() {
	const kok = document.documentElement;
	tercihler.tema = kok.dataset.theme === 'gece-vardiyasi' ? 'gece-vardiyasi' : 'tezgah';
	tercihler.plan = 'plan' in kok.dataset;
}

export function temaDegistir() {
	tercihler.tema = tercihler.tema === 'tezgah' ? 'gece-vardiyasi' : 'tezgah';
	document.documentElement.dataset.theme = tercihler.tema;
	sakla('tema', tercihler.tema);
}

export function planDegistir() {
	tercihler.plan = !tercihler.plan;
	const kok = document.documentElement;
	if (tercihler.plan) kok.dataset.plan = '';
	else delete kok.dataset.plan;
	sakla('plan', tercihler.plan ? '1' : null);
	bildir(tercihler.plan ? 'Plan modu açık: tezgahın iskeleti görünüyor.' : 'Plan modu kapandı.');
}

/** Plan modunda öğeye kesikli çerçeve ve etiket ekleyen sınıflar (data-plan-etiket ile). */
export const PLAN =
	'in-data-plan:relative in-data-plan:outline-2 in-data-plan:outline-dashed in-data-plan:outline-accent in-data-plan:outline-offset-2 in-data-plan:after:absolute in-data-plan:after:top-1 in-data-plan:after:left-1 in-data-plan:after:z-10 in-data-plan:after:bg-accent in-data-plan:after:px-1 in-data-plan:after:font-mono in-data-plan:after:text-[10px] in-data-plan:after:leading-4 in-data-plan:after:text-accent-content in-data-plan:after:content-[attr(data-plan-etiket)]';
