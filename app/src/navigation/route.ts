import { parseReference, type Reference } from "../bike/reference";

/*
 * Les écrans se choisissent par le `#` de l'adresse : le navigateur sait déjà garder
 * l'historique et le bouton retour, sans bibliothèque de routage. Le nom d'un écran est le
 * mot de l'adresse, en français puisqu'il se voit : `#recherche`, `#velo/261027.01`,
 * `#enregistrement`. Sans accent, qu'une adresse transformerait en `%C3%A9`.
 */
export type Route =
	| { screen: "recherche" }
	| { screen: "velo"; reference: Reference }
	| { screen: "enregistrement" };

export function parseRoute(hash: string): Route {
	const [screen, argument = ""] = hash.slice("#".length).split("/");
	switch (screen) {
		case "enregistrement":
			return { screen: "enregistrement" };
		case "velo": {
			const reference = parseReference(argument);
			return reference
				? { screen: "velo", reference }
				: { screen: "recherche" };
		}
		/* Une adresse inconnue ou mal tapée ramène à la recherche plutôt qu'à une page vide. */
		default:
			return { screen: "recherche" };
	}
}

export function formatRoute(route: Route): string {
	switch (route.screen) {
		case "velo":
			return `#velo/${route.reference}`;
		case "recherche":
		case "enregistrement":
			return `#${route.screen}`;
	}
}
