import { formatRoute, type Route } from "./route";

/*
 * Change d'adresse depuis le code, quand un lien ne suffit pas. Le choix est explicite :
 * - "push" ajoute une entrée à l'historique, comme un clic sur un lien ;
 * - "replace" remplace l'entrée courante : taper « peugeot » ne doit pas laisser sept
 *   entrées derrière soi, qu'il faudrait remonter une à une avec le bouton retour.
 */
export function navigate(
	route: Route,
	{ history }: { history: "push" | "replace" },
): void {
	const hash = formatRoute(route);
	if (history === "push") {
		window.location.hash = hash;
		return;
	}

	window.history.replaceState(null, "", hash);
	/* replaceState ne prévient personne : on émet l'événement qu'écoute useRoute. */
	window.dispatchEvent(new HashChangeEvent("hashchange"));
}
