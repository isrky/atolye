// @ts-check
import { fileURLToPath } from 'node:url';
import { escapeSvelte } from 'mdsvex';
import { createHighlighter } from 'shiki';
import katex from 'katex';
import remarkMath from 'remark-math';
import { visit } from 'unist-util-visit';
import { slugify } from './src/lib/content/slug.js';

const diller = [
	'js',
	'ts',
	'svelte',
	'html',
	'css',
	'json',
	'jsonc',
	'bash',
	'shell',
	'sql',
	'rust',
	'go',
	'python',
	'nix',
	'yaml',
	'toml',
	'diff',
	'md',
	'text'
];
const highlighter = await createHighlighter({
	themes: ['github-light', 'github-dark'],
	langs: diller
});

/** @param {string} s */
const kacis = (s) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Kod bloğu: ```ts title="dosya.ts"
 * Dosya adı sekmesi + kopyala düğmesi (düğme davranışı Duzen.svelte'de).
 * @param {string} kod
 * @param {string | null | undefined} dil
 * @param {string | null | undefined} meta
 */
function vurgula(kod, dil, meta) {
	const lang = dil && diller.includes(dil) ? dil : 'text';
	const dosya = meta?.match(/title="([^"]+)"/)?.[1];
	const html = highlighter.codeToHtml(kod, {
		lang,
		themes: { light: 'github-light', dark: 'github-dark' },
		defaultColor: false
	});
	const baslik = `<figcaption class="flex items-center justify-between gap-2 border-b-2 border-base-content bg-base-200 px-3 py-1 font-mono text-xs"><span>${kacis(dosya ?? lang)}</span><button type="button" data-kopyala class="btn btn-ghost btn-xs" aria-label="Kodu kopyala">Kopyala</button></figcaption>`;
	const cerceve = `<figure class="kod not-prose my-6 border-2 border-base-content bg-base-100 shadow-sert">${baslik}<div class="overflow-x-auto p-4 font-mono text-sm leading-relaxed [&_pre]:bg-transparent! [&_span]:text-(--shiki-light) in-data-[theme=gece-vardiyasi]:[&_span]:text-(--shiki-dark)">${html}</div></figure>`;
	return `{@html \`${escapeSvelte(cerceve)}\`}`;
}

/** Düz metin uzunluğundan okuma süresi (dk) ve özet sayısı. */
function okumaSuresi() {
	/** @param {any} tree @param {any} file */
	return (tree, file) => {
		let kelime = 0;
		visit(tree, 'text', (/** @type {any} */ n) => {
			kelime += n.value.split(/\s+/).filter(Boolean).length;
		});
		file.data.fm ??= {};
		file.data.fm.okumaSuresi = Math.max(1, Math.round(kelime / 200));
	};
}

/** @param {any} node */
function metinAl(node) {
	if (node.type === 'text') return node.value;
	return (node.children ?? []).map(metinAl).join('');
}

/** h2/h3 kimlikleri (Türkçe kısa ad), bağlantı çapası ve içindekiler listesi. */
function basliklar() {
	/** @param {any} tree @param {any} file */
	return (tree, file) => {
		/** @type {{ id: string; metin: string; seviye: number }[]} */
		const toc = [];
		const kullanilan = new Map();
		visit(tree, 'element', (/** @type {any} */ node) => {
			if (!['h2', 'h3', 'h4'].includes(node.tagName)) return;
			const metin = metinAl(node).trim();
			let id = slugify(metin) || 'baslik';
			const n = kullanilan.get(id) ?? 0;
			kullanilan.set(id, n + 1);
			if (n) id = `${id}-${n}`;
			node.properties = { ...node.properties, id, class: 'group scroll-mt-24' };
			node.children.push({
				type: 'element',
				tagName: 'a',
				properties: {
					href: `#${id}`,
					class:
						'ml-2 no-underline opacity-0 group-hover:opacity-60 focus:opacity-60 font-mono text-base',
					'aria-label': `“${metin}” bölümüne bağlantı`
				},
				children: [{ type: 'text', value: '#' }]
			});
			if (node.tagName !== 'h4') toc.push({ id, metin, seviye: Number(node.tagName[1]) });
		});
		file.data.fm ??= {};
		file.data.fm.toc = toc;
	};
}

/** remark-math düğümlerini derleme anında KaTeX HTML'ine çevirir ({ } kaçışlı). */
function matematik() {
	/** @param {any} tree */
	return (tree) => {
		visit(tree, 'element', (/** @type {any} */ node, i, /** @type {any} */ parent) => {
			if (i === undefined || !parent) return;
			const sinif = [node.properties?.className ?? []].flat();
			const blok = sinif.includes('math-display');
			if (!blok && !sinif.includes('math-inline')) return;
			const html = katex.renderToString(metinAl(node), {
				displayMode: blok,
				throwOnError: false
			});
			const sarili = blok ? `<div class="not-prose my-6 overflow-x-auto py-2">${html}</div>` : html;
			parent.children[i] = { type: 'raw', value: `{@html ${JSON.stringify(sarili)}}` };
		});
	};
}

/** @type {import('mdsvex').MdsvexOptions} */
export default {
	extensions: ['.md', '.svx'],
	smartypants: { dashes: 'oldschool' },
	layout: { _: fileURLToPath(new URL('./src/lib/markdown/Duzen.svelte', import.meta.url)) },
	layoutPropForwarding: 'runes',
	highlight: { highlighter: vurgula },
	remarkPlugins: [remarkMath, okumaSuresi],
	rehypePlugins: [basliklar, matematik]
};
