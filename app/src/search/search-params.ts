import { AUDIENCES } from "../bike/bike";
import type { BikeSearch } from "../bike/search";
import { STATUSES } from "../bike/status";
import type { ParamsCodec } from "../navigation/define-route";
import { toQueryString } from "../navigation/query-string";

/*
 * La recherche s'écrit dans l'adresse, après le `?` :
 * `#recherche?q=peugeot&statut=à+traiter&statut=prêt+à+la+vente&public=enfant`. Une chip
 * cochée y apparaît une fois par valeur. Les champs du formulaire de l'écran portent ces
 * mêmes noms : le formulaire et l'adresse se lisent par la même fonction.
 */
export const SEARCH_PARAM = {
	text: "q",
	statuses: "statut",
	audiences: "public",
} as const;

/* `satisfies` plutôt qu'une annotation : decode garde son type exact, une recherche n'est jamais `null`. */
export const searchCodec = {
	encode(search) {
		const query = toQueryString({
			[SEARCH_PARAM.text]: search.text,
			[SEARCH_PARAM.statuses]: search.statuses,
			[SEARCH_PARAM.audiences]: search.audiences,
		});
		return query === "" ? "" : `?${query}`;
	},

	/* L'adresse est une saisie comme une autre : une valeur inconnue y est ignorée. */
	decode(rest): BikeSearch {
		const params = new URLSearchParams(rest);
		return {
			text: params.get(SEARCH_PARAM.text) ?? "",
			statuses: keepKnown(STATUSES, params.getAll(SEARCH_PARAM.statuses)),
			audiences: keepKnown(AUDIENCES, params.getAll(SEARCH_PARAM.audiences)),
		};
	},
} satisfies ParamsCodec<BikeSearch>;

/** Ce que le bénévole a coché dans le formulaire de recherche, validé comme une adresse. */
export function readSearch(form: HTMLFormElement): BikeSearch {
	const params = new URLSearchParams();
	for (const [name, value] of new FormData(form)) {
		/* Le formulaire de recherche n'a que des champs texte ; un fichier n'y a pas sa place. */
		if (typeof value === "string") {
			params.append(name, value);
		}
	}
	return searchCodec.decode(params.toString());
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
