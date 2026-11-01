/*
 * Change d'adresse depuis le code, quand un lien ne suffit pas. Par défaut, comme un clic
 * sur un lien, une entrée s'ajoute à l'historique. Avec `replace`, l'entrée courante est
 * remplacée : taper « peugeot » ne doit pas laisser sept entrées derrière soi, qu'il
 * faudrait remonter une à une avec le bouton retour.
 */
export function navigate(
	href: string,
	{ replace = false }: { replace?: boolean } = {},
): void {
	if (!replace) {
		window.location.hash = href;
		return;
	}

	window.history.replaceState(null, "", href);
	/* replaceState ne prévient personne : on émet l'événement qu'écoute useScreen. */
	window.dispatchEvent(new HashChangeEvent("hashchange"));
}
