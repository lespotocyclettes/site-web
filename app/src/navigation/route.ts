import { parseReference, type Reference } from "../bike/reference";
import { type BikeSearch, IN_STOCK_SEARCH } from "../bike/search";
import { formatSearchParams, parseSearchParams } from "../search/search-params";

/*
 * Les écrans se choisissent par le `#` de l'adresse : le navigateur sait déjà garder
 * l'historique et le bouton retour, sans bibliothèque de routage. Le nom d'un écran est le
 * mot de l'adresse, en français puisqu'il se voit : `#recherche`, `#velo/261027.01`,
 * `#enregistrement`. Sans accent, qu'une adresse transformerait en `%C3%A9`.
 *
 * La recherche garde ses filtres dans l'adresse, après le `?` : le bouton retour, un
 * rechargement ou un lien partagé retrouvent la même liste.
 */
export type Route =
	| { screen: "recherche"; search: BikeSearch }
	| { screen: "velo"; reference: Reference }
	| { screen: "enregistrement" };

/** Là où arrive le bénévole : le lien du menu, une adresse vide ou mal tapée. */
export const IN_STOCK_ROUTE: Route = {
	screen: "recherche",
	search: IN_STOCK_SEARCH,
};

export function parseRoute(hash: string): Route {
	const [path = "", query = ""] = hash.slice("#".length).split("?");
	const [screen, argument = ""] = path.split("/");
	switch (screen) {
		case "recherche":
			return {
				screen: "recherche",
				search: parseSearchParams(new URLSearchParams(query)),
			};
		case "enregistrement":
			return { screen: "enregistrement" };
		case "velo": {
			const reference = parseReference(argument);
			return reference ? { screen: "velo", reference } : IN_STOCK_ROUTE;
		}
		/* Une adresse inconnue ou mal tapée ramène à la recherche plutôt qu'à une page vide. */
		default:
			return IN_STOCK_ROUTE;
	}
}

export function formatRoute(route: Route): string {
	switch (route.screen) {
		case "recherche": {
			const query = formatSearchParams(route.search);
			return query === "" ? "#recherche" : `#recherche?${query}`;
		}
		case "velo":
			return `#velo/${route.reference}`;
		case "enregistrement":
			return "#enregistrement";
	}
}
