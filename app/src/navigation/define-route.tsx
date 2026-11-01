import type { ComponentType, ReactElement } from "react";

/*
 * Les écrans se choisissent par le `#` de l'adresse : le navigateur sait déjà garder
 * l'historique et le bouton retour, sans bibliothèque de routage. Chaque écran déclare sa
 * route dans src/routes/, un fichier par adresse : `#recherche?q=…`, `#velo/261027.01`,
 * `#enregistrement`. Les noms sont en français puisqu'ils se voient, et sans accent,
 * qu'une adresse transformerait en `%C3%A9`.
 */

/**
 * Traduit les paramètres d'un écran en fin d'adresse, et retour. `decode` reçoit ce qui suit
 * le nom de l'écran (`/261027.01`, `?q=peugeot`, ou rien) ; il renvoie `null` quand
 * l'adresse ne veut rien dire, et l'app ouvre alors l'écran par défaut.
 */
export type ParamsCodec<T> = {
	encode(params: T): string;
	decode(rest: string): T | null;
};

/** Pour un écran sans paramètre : son adresse est son nom, rien après. */
export const NO_PARAMS: ParamsCodec<void> = {
	encode() {
		return "";
	},
	decode(rest) {
		return rest === "" ? undefined : null;
	},
};

/** Ce que l'app connaît d'une route : son nom, et de quoi afficher son écran. */
export type ScreenRoute = {
	name: string;
	render(rest: string): ReactElement | null;
};

export function defineRoute<T>({
	name,
	params,
	Screen,
}: {
	name: string;
	params: ParamsCodec<T>;
	Screen: ComponentType<{ params: T }>;
}) {
	return {
		name,
		/** L'adresse de cet écran : `<a href={bikeSheetRoute.href(reference)}>`. */
		href(value: T): string {
			return `#${name}${params.encode(value)}`;
		},
		/*
		 * Le type des paramètres reste caché ici : une liste de routes aux paramètres
		 * différents se range dans un même tableau de ScreenRoute.
		 */
		render(rest: string): ReactElement | null {
			const value = params.decode(rest);
			return value === null ? null : <Screen params={value} />;
		},
	};
}

/** L'écran que désigne une adresse, ou `null` si aucune route ne la comprend. */
export function matchScreen(
	routes: readonly ScreenRoute[],
	hash: string,
): ReactElement | null {
	const path = hash.slice("#".length);
	/* Le nom s'arrête au premier « / » ou « ? » ; le reste appartient à l'écran. */
	const [name = ""] = path.split(/[/?]/, 1);
	const rest = path.slice(name.length);
	const route = routes.find((candidate) => candidate.name === name);
	return route ? route.render(rest) : null;
}
