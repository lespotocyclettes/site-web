import { AUDIENCES } from "../bike/bike";
import type { BikeSearch } from "../bike/search";
import { STATUSES } from "../bike/status";

/*
 * La recherche s'écrit dans l'adresse, après le `?` :
 * `#recherche?q=peugeot&statut=à+traiter&statut=prêt+à+la+vente&public=enfant`. Une chip
 * cochée y apparaît une fois par valeur. Les champs du formulaire de l'écran portent ces
 * mêmes noms : le formulaire et l'adresse se lisent par la même fonction.
 */
export const SEARCH_FIELDS = {
	text: "q",
	statuses: "statut",
	audiences: "public",
} as const;

/** L'adresse est une saisie comme une autre : une valeur inconnue y est ignorée. */
export function parseSearchParams(params: URLSearchParams): BikeSearch {
	return {
		text: params.get(SEARCH_FIELDS.text) ?? "",
		statuses: keepKnown(STATUSES, params.getAll(SEARCH_FIELDS.statuses)),
		audiences: keepKnown(AUDIENCES, params.getAll(SEARCH_FIELDS.audiences)),
	};
}

export function formatSearchParams(search: BikeSearch): string {
	const params = new URLSearchParams();
	if (search.text !== "") {
		params.set(SEARCH_FIELDS.text, search.text);
	}
	for (const status of search.statuses) {
		params.append(SEARCH_FIELDS.statuses, status);
	}
	for (const audience of search.audiences) {
		params.append(SEARCH_FIELDS.audiences, audience);
	}
	return params.toString();
}

/** Ce que le bénévole a coché dans le formulaire de recherche, validé comme une adresse. */
export function readSearch(form: HTMLFormElement): BikeSearch {
	const params = new URLSearchParams();
	for (const [name, value] of new FormData(form)) {
		/* Le formulaire de recherche n'a que des champs texte ; un fichier n'y a pas sa place. */
		if (typeof value === "string") {
			params.append(name, value);
		}
	}
	return parseSearchParams(params);
}

/*
 * Les valeurs connues, dans l'ordre de leur liste et sans doublon : deux adresses qui
 * cochent la même chose donnent la même recherche, et donc la même clé de requête.
 */
function keepKnown<T extends string>(
	known: readonly T[],
	values: readonly string[],
): readonly T[] {
	return known.filter((value) => {
		return values.includes(value);
	});
}
