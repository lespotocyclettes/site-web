import { parseReference, type Reference } from "../bike/reference";

/*
 * Les écrans se choisissent par le `#` de l'adresse : le navigateur sait déjà garder
 * l'historique et le bouton retour, sans bibliothèque de routage. Les adresses sont en
 * français, puisqu'elles se voient.
 */
export type Route =
	| { screen: "search" }
	| { screen: "bike"; reference: Reference }
	| { screen: "registration" };

const BIKE_PREFIX = "#velo/";

export function parseRoute(hash: string): Route {
	if (hash === "#enregistrement") return { screen: "registration" };

	const reference = hash.startsWith(BIKE_PREFIX)
		? parseReference(hash.slice(BIKE_PREFIX.length))
		: undefined;
	if (reference) return { screen: "bike", reference };

	/* Une adresse inconnue ou mal tapée ramène à la recherche plutôt qu'à une page vide. */
	return { screen: "search" };
}

export function formatRoute(route: Route): string {
	switch (route.screen) {
		case "search":
			return "#recherche";
		case "bike":
			return `${BIKE_PREFIX}${route.reference}`;
		case "registration":
			return "#enregistrement";
	}
}
