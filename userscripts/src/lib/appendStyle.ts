/** Ajoute une feuille de style à la page. */
export function appendStyle(css: string, id?: string): HTMLStyleElement {
	const style = document.createElement("style");
	style.textContent = css;
	if (id) style.id = id;
	document.head.append(style);
	return style;
}
